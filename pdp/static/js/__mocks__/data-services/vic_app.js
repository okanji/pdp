// Mock data-services module for testing vic_app
// For tests only, so is a pure Node module
// Note this does not follow the arrangement for
// [Jest module "manual mocks"] (https://jestjs.io/docs/en/manual-mocks)
// Mocks the metadata for the vic gen2 data collection, which is the default
// for this portal; the archive vic gen1 data also served by this portal is not
// mocked.

var convert = require('xml-js');

var mockHelpers = require('../../__test__/mock-helpers');
var makeMockGet = mockHelpers.makeMockGet;

// Mocking presently only for wind_day_TPS_NWNA_v1_historical_19450101-20121231

var catalog = {
	"BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia": "https://data.fake.org/data/hydro_model_out/allwsbc.ACCESS1-0_rcp85_r1i1p1.1945to2099.BASEFLOW.nc"
};
var getCatalog = makeMockGet('Catalog', catalog);


var metadata = {
    "units": "mm", "max": 211.758, "min": 0.0
};
var getMetadata = makeMockGet('Metadata', metadata);


var rasterAccordionMenuData = {
	"rcp85": {
		"ACCESS1-0": {
			"GLAC_AREA": "GLAC_AREA_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"TRANSP_VEG": "TRANSP_VEG_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"PET_NATVEG": "PET_NATVEG_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"SNOW_MELT": "SNOW_MELT_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"EVAP": "EVAP_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"GLAC_MBAL": "GLAC_MBAL_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"SWE": "SWE_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"PREC": "PREC_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"GLAC_OUTFLOW": "GLAC_OUTFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"RUNOFF": "RUNOFF_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"SOIL_MOIST_TOT": "SOIL_MOIST_TOT_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"RAINF": "RAINF_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia", 
			"BASEFLOW": "BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia"
		}
	}
};
var getRasterAccordionMenuData = makeMockGet(
    'RasterAccordionMenuData', rasterAccordionMenuData, true);


// TODO: Feckin ell, can we cut this down?
// Maybe just to what the receiver cares about?
var ncwmsLayerCapablilitiesXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<!DOCTYPE WMT_MS_Capabilities SYSTEM "http://schemas.opengis.net/wms/1.1.1/capabilities_1_1_1.dtd">',
    '<WMT_MS_Capabilities',
    '        version="1.1.1"',
    '        updateSequence="2020-01-14T21:47:24.987Z"',
    '        xmlns:xlink="http://www.w3.org/1999/xlink">',
    '    <!-- Service Metadata -->',
    '    <Service>',
    '        <!-- The WMT-defined name for this type of service -->',
    '        <Name>OGC:WMS</Name>',
    '        <!-- Human-readable title for pick lists -->',
    '        <Title>My ncWMS server</Title>',
    '        <!-- Narrative description providing additional information -->',
    '        <Abstract> </Abstract>',
    '        <KeywordList>',
    '            <Keyword> </Keyword>',            
    '        </KeywordList>',
    '        <!-- Top-level web address of service or service provider. See also OnlineResource',
    '        elements under <DCPType>. -->',
    '        <OnlineResource xlink:type="simple" xlink:href=" "/>',
    '        <!-- Contact information -->',
    '        <ContactInformation>',
    '            <ContactPersonPrimary>',
    '                <ContactPerson> </ContactPerson>',
    '                <ContactOrganization> </ContactOrganization>',
    '            </ContactPersonPrimary>',
    '            <ContactVoiceTelephone> </ContactVoiceTelephone>',
    '            <ContactElectronicMailAddress> </ContactElectronicMailAddress>',
    '        </ContactInformation>',
    '        <!-- Fees or access constraints imposed. -->',
    '        <Fees>none</Fees>',
    '        <AccessConstraints>none</AccessConstraints>',
    '    </Service>',
    '    <Capability>',
    '        <Request>',
    '            <GetCapabilities>',
    '                <Format>application/vnd.ogc.wms_xml</Format>',
    '                <DCPType>',
    '                    <HTTP>',
    '                        <Get>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms" />',
    '                        </Get>',
    '                    </HTTP>',
    '                </DCPType>',
    '            </GetCapabilities>',
    '            <GetMap>',
    '                <Format>image/png</Format>',                
    '                <Format>image/png;mode=32bit</Format>',
    '                <Format>image/gif</Format>',
    '                <Format>image/jpeg</Format>',
    '                <Format>application/vnd.google-earth.kmz</Format>',
    '                <DCPType>',
    '                    <HTTP>',
    '                        <Get>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms" />',
    '                        </Get>',
    '                    </HTTP>',
    '                </DCPType>',
    '            </GetMap>',
    '            <GetFeatureInfo>',
    '                <Format>image/png</Format>',
    '                <Format>text/xml</Format>',
    '                <DCPType>',
    '                    <HTTP>',
    '                        <Get>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms" />',
    '                        </Get>',
    '                    </HTTP>',
    '                </DCPType>',
    '            </GetFeatureInfo>',
    '        </Request>',
    '        <Exception>',
    '            <Format>application/vnd.ogc.se_xml</Format>',
    '            <!--<Format>application/vnd.ogc.se_inimage</Format>',
    '            <Format>application/vnd.ogc.se_blank</Format>-->',
    '        </Exception>',
    '        <Layer>',
    '            <Title>My ncWMS server</Title>',
    '            <SRS>EPSG:4326</SRS>',
    '            <SRS>CRS:84</SRS>',
    '            <SRS>EPSG:41001</SRS>',
    '            <SRS>EPSG:27700</SRS>',
    '            <SRS>EPSG:3408</SRS>',
    '            <SRS>EPSG:3409</SRS>',
    '            <SRS>EPSG:3857</SRS>',
    '            <SRS>EPSG:32661</SRS>',
    '            <SRS>EPSG:32761</SRS>',
    '            <Layer>',
    '                <Title>BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia</Title>',
    '                <Layer queryable="1">',
    '                    <Name>BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW</Name>',
    '                    <Title>lwe_thickness_of_baseflow_amount</Title>',
    '                    <Abstract>Baseflow out of the bottom layer</Abstract>',
    '                    <LatLonBoundingBox minx="-140.0" maxx="-109.0" miny="41.0625" maxy="64.0"/>',
    '                    <BoundingBox SRS="EPSG:4326" minx="-140.0" maxx="-109.0" miny="41.0625" maxy="64.0"/>',
    '                    <Dimension name="time" units="ISO8601"/>',
    '                    <Extent name="time" multipleValues="1" current="1" default="2020-01-14T00:00:00.000Z">',
    '                                1945-01-01T00:00:00.000Z/2099-12-31T00:00:00.000Z/P1D',
    '                    </Extent>',
    '                    <Style>',
    '                      <Name>default/blue_brown</Name>',
    '                        <Title>default/blue_brown</Title>',
    '                        <Abstract>default style, using the blue_brown palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blue_brown"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/blue7_red3</Name>',
    '                        <Title>default/blue7_red3</Title>',
    '                        <Abstract>default style, using the blue7_red3 palette </Abstract>',
    '                        <LegendURL width="110" height="264"> ',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blue7_red3"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/redblue</Name>',
    '                        <Title>default/redblue</Title>',
    '                        <Abstract>default style, using the redblue palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=redblue"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/ncview</Name>',
    '                        <Title>default/ncview</Title>',
    '                        <Abstract>default style, using the ncview palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=ncview"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/lightblue_darkblue_log</Name>',
    '                        <Title>default/lightblue_darkblue_log</Title>',
    '                        <Abstract>default style, using the lightblue_darkblue_log palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=lightblue_darkblue_log"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/sst_36</Name>',
    '                        <Title>default/sst_36</Title>',
    '                        <Abstract>default style, using the sst_36 palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=sst_36"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/greyscale</Name>',
    '                        <Title>default/greyscale</Title>',
    '                        <Abstract>default style, using the greyscale palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=greyscale"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/lightblue_darkblue</Name>',
    '                        <Title>default/lightblue_darkblue</Title>',
    '                        <Abstract>default style, using the lightblue_darkblue palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=lightblue_darkblue"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/occam_pastel-30</Name>',
    '                        <Title>default/occam_pastel-30</Title>',
    '                        <Abstract>default style, using the occam_pastel-30 palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=occam_pastel-30"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/blue4_red6</Name>',
    '                        <Title>default/blue4_red6</Title>',
    '                        <Abstract>default style, using the blue4_red6 palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blue4_red6"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/rainbow</Name>',
    '                        <Title>default/rainbow</Title>',
    '                        <Abstract>default style, using the rainbow palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=rainbow"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/occam_inv</Name>',
    '                        <Title>default/occam_inv</Title>',
    '                        <Abstract>default style, using the occam_inv palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=occam_inv"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/occam</Name>',
    '                        <Title>default/occam</Title>',
    '                        <Abstract>default style, using the occam palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=occam"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/blueheat</Name>',
    '                        <Title>default/blueheat</Title>',
    '                        <Abstract>default style, using the blueheat palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blueheat"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/red_yellow</Name>',
    '                        <Title>default/red_yellow</Title>',
    '                        <Abstract>default style, using the red_yellow palette </Abstract>',
    '                        <LegendURL width="110" height="264">', 
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=red_yellow"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/blue6_red4</Name>',
    '                        <Title>default/blue6_red4</Title>',
    '                        <Abstract>default style, using the blue6_red4 palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blue6_red4"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/lightblue_darkblue_log_nc</Name>',
    '                        <Title>default/lightblue_darkblue_log_nc</Title>',
    '                        <Abstract>default style, using the lightblue_darkblue_log_nc palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=lightblue_darkblue_log_nc"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/brown_green</Name>',
    '                        <Title>default/brown_green</Title>',
    '                        <Abstract>default style, using the brown_green palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=brown_green"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/alg2</Name>',
    '                        <Title>default/alg2</Title>',
    '                        <Abstract>default style, using the alg2 palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=alg2"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/blue_darkred</Name>',
    '                        <Title>default/blue_darkred</Title>',
    '                        <Abstract>default style, using the blue_darkred palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=blue_darkred"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/ferret</Name>',
    '                        <Title>default/ferret</Title>',
    '                        <Abstract>default style, using the ferret palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=ferret"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/alg</Name>',
    '                        <Title>default/alg</Title>',
    '                        <Abstract>default style, using the alg palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=alg"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/yellow_red</Name>',
    '                        <Title>default/yellow_red</Title>',
    '                        <Abstract>default style, using the yellow_red palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=yellow_red"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                    <Style>',
    '                      <Name>default/brown_blue</Name>',
    '                        <Title>default/brown_blue</Title>',
    '                        <Abstract>default style, using the brown_blue palette </Abstract>',
    '                        <LegendURL width="110" height="264">',
    '                            <Format>image/png</Format>',
    '                            <OnlineResource xlink:type="simple" xlink:href="http://services.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&amp;LAYER=BASEFLOW_day_VICGL_ACCESS1-0_rcp85_r1i1p1_19450101-20991231_columbia/BASEFLOW&amp;PALETTE=brown_blue"/>',
    '                        </LegendURL>',
    '                    </Style>',
    '                </Layer>',
    '            </Layer>',
    '        </Layer>',
    '    </Capability>',
    '</WMT_MS_Capabilities>'
].join('\n');
var ncwmsLayerCapabilities = convert.xml2js(ncwmsLayerCapablilitiesXml);
var getNCWMSLayerCapabilities = makeMockGet('NCWMSLayerCapabilities', ncwmsLayerCapabilities);


var ncwmsLayerDDS = [
    [
    	'Dataset {',
    	'Float64 time[time = 56613];',
		'} allwsbc%2EACCESS1-0_rcp85_r1i1p1%2E1945to2099%2EBASEFLOW%2Enc;'
    ].join('\n')
];
var getNcwmsLayerDDS = makeMockGet('NcwmsLayerDDS', ncwmsLayerDDS);


var ncwmsLayerDAS = [
    [
    	'Attributes {',
		'    NC_GLOBAL {',
        '		String model_cal__dataset "Thin plate spline w/ ClimateWNA for northwestern North America";',
        '		String method_id "VICGL";',
        '		String downscaling__GCM__experiment_id "rcp85";',
        '		String model_cal__start_date "1985-01-01T00:00:00";',
        '		String downscaling__target__dataset_id "PNWNAmet";',
        '		String downscaling__target__dataset "Thin plate spline w/ ClimateWNA for northwestern North America";',
        '		String domain "columbia";',
        '		String creation_date "2017-01-09-T09:39:06";',
        '		Float64 model_start_day 1;',
        '		String model_cal__references "http://www.pacificclimate.org";',
        '		String frequency "day";',
        '		String model_cal__end_date "2005-12-31T23:00:00";',
        '		String downscaling__target__references "Werner et al. 2019 https://www.nature.com/articles/sdata2018299";',
        '		String downscaling__method "Bias-corrected Constructed Analogues with Quantile Reordering";',
        '		String downscaling__method_id "BCCAQ";',
        '		String title "Dummy File for COLUMBIA+PEACE+FRASER_CMIP5_Hydrologic_Projection_for_Experiment_ACCESS1-0.rcp85.r1i1p1";',
        '		String downscaling__GCM__institute_id "CSIRO-BOM";',
        '		Float64 model_start_year 1945;',
        '		String model_cal__contact "Markus Schnorbus, mschnorb@uvic.ca";',
        '		String forcing_type "downscaled gcm";',
        '		String source "/home/wernera/project/wernera/packing_netcdfs/make_dummy_flux_hard_coded_attributes_test.r";',
        '		String model_cal__dataset_id "PNWNAmet";',
        '		String version "VICGL 1.0";',
        '		String CDI "Climate Data Interface version 1.7.2 (http://mpimet.mpg.de/cdi)";',
        '		String project_id "CMIP5";',
        '		String type "gridded fluxes";',
        '		String method "Variable Infiltration Capacity Model GL";',
        '		String institute_id "PCIC";',
        '		String downscaling__GCM__initialization_method "1";',
        '		String product "hydrological model output";',
        '		Float64 model_start_month 1;',
        '		String downscaling__GCM__model_name "Australian Community Climate and Earth System Simulator (version 1.0)";',
        '		String downscaling__GCM__model_id "ACCESS1-0";',
        '		String downscaling__GCM__physics_version "1";',
        '		String NCO "\"4.6.0\"";',
        '		Float64 model_start_hour 0;',
        '		String configuration_id "/storage/data/projects/hydrology/configuration/configuration_id.yml";',
        '		String downscaling__GCM__experiment "Representative Concentration Pathways";',
        '		String references "http://www.pacificclimate.org";',
        '		String modeling_realm "land surface";',
        '		String downscaling__target__institute_id "PCIC";',
        '		String downscaling__GCM__realization "1";',
        '		String institution "Pacific Climate Impacts Consortium (PCIC)";',
        '		String downscaling__target__institution "Pacific Climate Impacts Consortium (PCIC)";',
        '		Float64 model_end_month 12;',
        '		Int32 nco_openmp_thread_number 1;',
        '		String downscaling__package_id "CLIMDOWN 1.0.2";',
        '		String model_cal__institution "Pacific Climate Impacts Consortium (PCIC)";',
        '		String CDO "Climate Data Operators version 1.7.2 (http://mpimet.mpg.de/cdo)";',
        '		String model_cal__institute_id "PCIC";',
        '		String downscaling__GCM__institution "CSIRO (Commonwealth Scientific and Industrial Research Organisation) and BOM (Bureau of Meteorology)";',
        '		String Conventions "CF-1.6";',
        '		String downscaling__target__version "1.0";',
        '		String contact "Markus Schnorbus, mschnorb@uvic.ca";',
        '		String table_id "Table day (10 Jun 2010)";',
        '		Float64 model_end_day 31;',
        '		Float64 model_end_year 2099;',
        '		String resolution "0.0625dd";',
        '		String downscaling__target__dataset__contact "Markus Schnorbus, mschnorb@uvic.ca";',
        '		String model_cal__version "NA";',
        '		String history "long history elided";',
		'   }',
    	'	DODS_EXTRA {',
        '		String Unlimited_Dimension "time";',
    	'	}',
    	'	BASEFLOW {',
        '		String category "cell";',
        '		Int16 _FillValue -32767;',
        '		Float32 scale_factor -0.00323136;',
        '		String internal_vic_name "OUT_BASEFLOW";',
        '		Float32 add_offset 105.879;',
        '		String long_name "Baseflow out of the bottom layer";',
        '		String standard_name "lwe_thickness_of_baseflow_amount";',
        '		String cell_methods "time: mean area: mean";',
        '		String units "mm";',
        '		Int32 _Netcdf4Dimid 0;',
        '		Float32 missing_value -32767;',
    	'	}',
    	'	lat {',
        '		String long_name "latitude";',
        '		String standard_name "latitude";',
        '		String NAME "lat";',
        '		String units "degrees_north";',
        '		Int32 _Netcdf4Dimid 1;',
        '		String CLASS "DIMENSION_SCALE";',
        '		String axis "Y";',
    	'	}',
    	'	lon {',
        '		String long_name "longitude";',
        '		String standard_name "longitude";',
        '		String NAME "lon";',
        '		String units "degrees_east";',
        '		Int32 _Netcdf4Dimid 2;',
        '		String CLASS "DIMENSION_SCALE";',
        '		String axis "X";',
    	'	}',
    	'	time {',
        '		String NAME "time";',
        '		String long_name "time";',
        '		String standard_name "time";',
        '		String units "days since 1945-1-1 00:00:00";',
        '		Int32 _Netcdf4Dimid 0;',
        '		String calendar "standard";',
        '		String CLASS "DIMENSION_SCALE";',
        '		String axis "T";',
    	'	}',
		'}',
    ].join('\n')
];
var getNcwmsLayerDAS = makeMockGet('NcwmsLayerDAS', ncwmsLayerDAS);


var getStationCount = mockHelpers.unexpectedRequest({
    name: 'getStationCount', log: true, throw: true,
});


var getRecordLength = mockHelpers.unexpectedRequest({
    name: 'getRecordLength', log: true, throw: true,
});


module.exports = {
    getCatalog: getCatalog,
    getMetadata: getMetadata,
    getRasterAccordionMenuData: getRasterAccordionMenuData,
    getNCWMSLayerCapabilities: getNCWMSLayerCapabilities,
    getNcwmsLayerDDS: getNcwmsLayerDDS,
    getNcwmsLayerDAS: getNcwmsLayerDAS,
    getStationCount: getStationCount,
    getRecordLength: getRecordLength,
};
