# Integration tests for the the full data portal web application

import sys
from os.path import dirname
from tempfile import mkdtemp
from shutil import rmtree
import random
import cPickle
import re

import py
import webob
import pytest
from webob.request import Request
from beaker.middleware import SessionMiddleware

from pdp.wsgi import frontend

@pytest.fixture(scope="module")
def session_dir(request):
    dirname = py.path.local(mkdtemp())
    request.addfinalizer(lambda: dirname.remove(rec=1, ignore_errors=True))
    return str(dirname)

@pytest.fixture(scope="module")
def static_url_space():
    return frontend

@pytest.fixture(scope="function")
def raster_pydap():
    from pdp.portals.bcsd_downscale_canada import portal
    return portal

@pytest.fixture(scope="function")
def prism_portal():
    from pdp.portals.bc_prism import portal
    return portal

@pytest.fixture(scope="module")
def pcic_data_portal(session_dir):
    from pdp.wsgi import dev_server
    return SessionMiddleware(dev_server, auto=1, data_dir=session_dir)

@pytest.fixture(scope="module")
def pcds_map_app():
    from pdp.portals.pcds import portal
    return portal

@pytest.fixture(scope="module")
def check_auth_app(session_dir):
    from pdp.wsgi import check_auth
    return SessionMiddleware(check_auth, auto=1, data_dir=session_dir)

@pytest.fixture(scope="module")
def authorized_session_id(check_auth_app):
    # FIXME: I shouldn't have to do this, but the store doesn't get initialized until the first request

    oid_app = check_auth_app.wrap_app
    try:
        oid_app({}, None)
    except:
        pass
    
    assoc_handle = 'handle'
    saved_assoc = 'saved'
    claimed_id = 'test_id'
    oid_app.store.add_association(claimed_id, None, saved_assoc)
    oid_app.store.add_association(assoc_handle, None, saved_assoc)

    session = str(random.getrandbits(40))
    oid_app.store.start_login(session, cPickle.dumps((claimed_id, assoc_handle)))

    # Simulate the return from the openid provider
    req = Request.blank('?openid_return='+session+'&openid.signed=yes')
    resp = req.get_response(check_auth_app)
    assert resp.status == '200 OK'
    assert 'Set-cookie' in resp.headers
    
    m = re.search(r'beaker.session.id=([a-f0-9]+);', resp.headers['Set-cookie'])
    return m.group(1)
