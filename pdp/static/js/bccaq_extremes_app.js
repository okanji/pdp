/*jslint browser: true, devel: true */
/*global $, jQuery, OpenLayers, pdp, map, init_raster_map, getOLClickHandler, processNcwmsLayerMetadata, getRasterControls, getRasterDownloadOptions, getPlotWindow, ddsToTimeIndex, RasterDownloadLink, MetadataDownloadLink*/

"use strict";

$(document).ready(function () {
    var map, clickHandler, ncwmsLayer, selectionLayer,
        dlLink, mdLink, catalogUrl, catalog_request, catalog,
        capabilities_request, ncwms_capabilities;

    map = init_raster_map();
    clickHandler = getOLClickHandler(map);
    map.events.register('click', map, clickHandler);


    ncwmsLayer = map.getClimateLayer();
    selectionLayer = map.getSelectionLayer();

    catalogUrl = "../catalog/catalog.json";
    catalog_request = $.ajax(catalogUrl, { dataType: "json"});

    capabilities_request = getNCWMSLayerCapabilities(ncwmsLayer);

    document.getElementById("pdp-controls").appendChild(getRasterControls(pdp.ensemble_name));
    document.getElementById("pdp-controls").appendChild(getRasterDownloadOptions(false));
    document.getElementById("pdp-controls").appendChild(getPlotWindow());

    // Data Download Link
    dlLink = new RasterDownloadLink($('#download-timeseries'), ncwmsLayer, undefined, 'nc', 'rx1dayETCCDI', '0:151', '0:510', '0:1068');
    $('#data-format-selector').change(
        function (evt) {
            dlLink.onExtensionChange($(this).val());
        }
    );

    ncwmsLayer.events.register('change', dlLink, function () {
        processNcwmsLayerMetadata(ncwmsLayer, catalog);
        capabilities_request = getNCWMSLayerCapabilities(ncwmsLayer);
        capabilities_request.done(function(data) {
            ncwms_capabilities = data;
            if (selectionLayer.features.length > 0) {
                dlLink.onBoxChange({feature: selectionLayer.features[0]}, ncwms_capabilities);
            }
        });
    });
    ncwmsLayer.events.register('change', dlLink, dlLink.onLayerChange);

    selectionLayer.events.register('featureadded', dlLink, function (selection){
        capabilities_request.done(function(data) {
            ncwms_capabilities = data;
            dlLink.onBoxChange(selection, data);
        });
    });

    dlLink.register($('#download-timeseries'), function (node) {
        node.attr('href', dlLink.getUrl());
    }
                   );
    dlLink.trigger();

    // Metadata/Attributes Download Link
    mdLink = new MetadataDownloadLink($('#download-metadata'), ncwmsLayer, undefined);
    ncwmsLayer.events.register('change', mdLink, mdLink.onLayerChange);
    mdLink.register($('#download-metadata'), function (node) {
        node.attr('href', mdLink.getUrl());
    }
                   );
    mdLink.trigger();

    function getTimeIndex(layer_name) {
        var layerUrl = catalog[layer_name.split('/')[0]];
        const reg = new RegExp(pdp.data_root + '/(.*)/(.*)');
        const matches = reg.exec(layerUrl);
        layerUrl = pdp.app_root + "/" + matches[1] + "/catalog/" + matches[2];

        var maxTimeReq = $.ajax({
                url: layerUrl + ".dds?time"
            });
        $.when(maxTimeReq).done(function (maxTime, unitsSince) {
            var maxTimeIndex = ddsToTimeIndex(maxTime);
            ncwms.max_time_index = maxTimeIndex;
            //
            dlLink.trange = '0:' + maxTimeIndex;
            mdLink.trange = '0:' + maxTimeIndex;
        });
    }

    ncwms.events.register('change', ncwms, getTimeIndex);

    capabilities_request.done(function (data) {
        ncwms_capabilities = data;
    });
    catalog_request.done(function (data) {
        catalog = dlLink.catalog = mdLink.catalog = data;
        processNcwmsLayerMetadata(ncwmsLayer, catalog);
        // Set the data URL as soon as it is available
        dlLink.onLayerChange();
        mdLink.onLayerChange();
    });

});
