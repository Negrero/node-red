RED.projects = (function() {



    function containsTab(id) {
        return sidebar_tabs.contains(id);
    }
    var projects=[]
    function init (data) {
        projects={}
        $.each(data, function(key, value) {
            projects[value._id]=value
            $('#selectProjects').append($("<option/>", {
                value: value._id,
                text: value.description
            }));
        });
        $('#selectProjects').change(function(){
            var id=$(this).val()
        })
    }

    return {
        init: init,
        getProjects: projects
    }

})();