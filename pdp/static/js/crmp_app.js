$(document).ready(function() {
    map = init_crmp_map();    

    var loginButton = pdp.init_login("login-div");
    pdp.checkLogin(loginButton);
    
    var filtChange = pdp.curry(CRMPFilterChange, map);

    var downloadForm = pdp.createForm("download-form", "download-form", "get", pdp.app_root + "/auth/agg/")
    document.getElementById("pdp-controls").appendChild(downloadForm);
    
    var filters = downloadForm.appendChild(getCRMPControls(map));
    var download = downloadForm.appendChild(getCRMPDownloadOptions());
    
    map.filters = {};
    map.filters.values = getActiveFilters;
    map.composite_filter = '';
    map.getControlsByClass('OpenLayers.Control.DrawFeature')[0].events.register('featureadded', '', pdp.curry(polyChange, map));

    // Populate selection information textbox initially.
    filtChange();
});
