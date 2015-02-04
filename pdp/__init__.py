'''The pdp package ties together all of the aspects of the PCIC Data Portal (pdp).
   The base pdp module configures the application, sets up a URL hierarchy (a PathDispatcher instance),
   instantiates all of the responder applications and binds them to various PathDispatchers.
'''

import os
from os.path import dirname
import atexit

from pkg_resources import resource_filename, get_distribution
from tempfile import mkdtemp
from shutil import rmtree


import static
from beaker.middleware import SessionMiddleware

from pdp_util.auth import PcicOidMiddleware, check_authorized_return_email
from pdp_util.counts import CountStationsApp, CountRecordLengthApp
from pdp_util.legend import LegendApp
from pdp_util.agg import PcdsZipApp
from pdp_util.pcds_dispatch import PcdsDispatcher
from ga_wsgi_client import AnalyticsMiddleware
from pdp.error import ErrorMiddleware
from pdp.dispatch import PathDispatcher
from pdp.minify import wrap_mini

here = os.getcwd()

dsn = 'postgresql://httpd_meta@atlas.pcic/pcic_meta'
pcds_dsn = 'postgresql://httpd@atlas.pcic/crmp'

global_config = {
    'app_root': 'http://medusa.pcic.uvic.ca/dataportal',
    'title': "CRMP Network Data",
    'css_files': [
        'css/jquery-ui-1.10.2.custom.css',
        'css/reset.css',
        'css/main.css',
        'css/map.css',
        'css/header.css',
        'css/footer.css',
        'css/login.css',
        'css/controls.css',
        'css/menu.css'],
    'js_files': [
        'js/ie8.js', # must be included before OL
        'js/jquery-1.10.2.js',
        'js/jquery-ui-1.10.2.custom.js',
        'js/zebra.js',
        'js/OL/OpenLayers-2.13.1.js',
        'js/proj4js-compressed.js',
        'js/multiaccordion.js'] +
        wrap_mini(['js/pdp_dom_library.js',
        'js/pdp_controls.js',
        'js/pdp_download.js',
        'js/pdp_filters.js',
        'js/pdp_map.js',
        'js/pdp_auth.js',
        'js/pdp_raster_map.js',
        'js/pdp_vector_map.js'
        ], debug=True),
    'geoserver_url': 'http://atlas.pcic.uvic.ca/geoserver/',
    'ncwms_url': ['http://atlas.pcic.uvic.ca/ncWMS/wms'],
    'tilecache_url': ['http://a.tiles.pacificclimate.org/tilecache/tilecache.py', 'http://b.tiles.pacificclimate.org/tilecache/tilecache.py', 'http://c.tiles.pacificclimate.org/tilecache/tilecache.py'],
    'ensemble_name': '',
    'templates': os.path.join(here, 'pdp', 'templates'),
    'session_dir': mkdtemp(),
    'clean_session_dir': True,
    'version': get_distribution('pdp').version
    }

def clean_session_dir(session_dir, should_I):
    if should_I:
        print('Removing session directory {}'.format(session_dir))
        rmtree(session_dir)

atexit.register(clean_session_dir, global_config['session_dir'], global_config['clean_session_dir'])

# auth wrappers
def wrap_auth(app, required=True):
    '''This function wraps a WSGI application with the PcicOidMiddleware for session management and optional authentication
    '''
    app = PcicOidMiddleware(app,
                            templates=resource_filename('pdp', 'templates'),
                            root=global_config['app_root'],
                            auth_required=required)
    return app

check_auth = wrap_auth(check_authorized_return_email, required=False)

from portals.pcds import portal as pcds_map

zip_app = wrap_auth(PcdsZipApp(pcds_dsn), required=True)

count_stations_app = CountStationsApp(pcds_dsn)
record_length_app = CountRecordLengthApp(pcds_dsn, max_stns=100)
legend_app = LegendApp(pcds_dsn)

static_app = static.Cling(resource_filename('pdp', 'static'))
docs_app = static.Cling(dirname(__file__) + '/../doc')

dispatch_app = wrap_auth(PcdsDispatcher(templates=resource_filename('pdp_util', 'templates'),
                                        ol_path=None, #global_config['ol_path'],
                                        app_root=global_config['app_root'],
                                        conn_params=pcds_dsn
                                        ),
                        required=False)

import portals.bc_prism as bc_prism
from portals.bc_prism import portal as bc_prism_portal
from portals.bc_prism import data_server as bc_prism_data_server

from portals.hydro_stn import portal as hydro_stn

import portals.bcsd_downscale_canada as bcsd_canada
from portals.bcsd_downscale_canada import portal as bcsd_canada_portal
from portals.bcsd_downscale_canada import data_server as bcsd_canada_data_server

import portals.bccaq_extremes as bccaq_extremes
from portals.bccaq_extremes import portal as bccaq_extremes_portal
from portals.bccaq_extremes import data_server as bccaq_extremes_data_server

import portals.vic_gen1 as vic_gen1
from portals.vic_gen1 import portal as vic_gen1_portal
from portals.vic_gen1 import data_server as vic_gen1_data_server

data = PathDispatcher([
    ('^/{}/.*$'.format(bc_prism.url_base), bc_prism_data_server(dsn, global_config, bc_prism.ensemble_name)),
    ('^/{}/.*$'.format(bcsd_canada.url_base), bcsd_canada_data_server(dsn, global_config, bcsd_canada.ensemble_name)),
    ('^/{}/.*$'.format(vic_gen1.url_base), vic_gen1_data_server(dsn, global_config, vic_gen1.ensemble_name)),
    ('^/{}/.*$'.format(bccaq_extremes.url_base), bccaq_extremes_data_server(dsn, global_config, bccaq_extremes.ensemble_name)),
    ])

auth = PathDispatcher([
    ('^/pcds/.*$', dispatch_app),
    # ('^/pydap/.*$', pydap_app),
    ('^/agg/?$', zip_app),
    ])

apps = PathDispatcher([
    ('^/record_length/?$', record_length_app),
    ('^/count_stations/?$', count_stations_app),
    ])    
    
main = PathDispatcher([
    ('^/images/legend/.*\.png$', legend_app),
    ('^/css/(default|pcic).css$', static.Cling(resource_filename('pdp_util', 'data'))), # a bit of a hack for now
    ('^/check_auth_app/?$', check_auth),
    ('^/pcds_map/.*$', pcds_map(pcds_dsn, global_config)),
    ('^/hydro_stn/.*$', hydro_stn(global_config)),
    ('^/{}/.*$'.format(bc_prism.url_base), bc_prism_portal(dsn, global_config)),
    ('^/{}/.*$'.format(vic_gen1.url_base), vic_gen1_portal(dsn, global_config)),
    ('^/{}/.*$'.format(bcsd_canada.url_base), bcsd_canada_portal(dsn, global_config)),
    ('^/{}/.*$'.format(bccaq_extremes.url_base), bccaq_extremes_portal(dsn, global_config)),
    ('^/auth.*$', auth),
    ('^/data/.*$', data),
    ('^/apps/.*$', apps),
    ('^/docs/.*$', docs_app),
    ],
    default=static_app
)

main = AnalyticsMiddleware(main, 'UA-20166041-3')
main = SessionMiddleware(main, auto=1, data_dir=global_config['session_dir'])
main = ErrorMiddleware(main)

# main
