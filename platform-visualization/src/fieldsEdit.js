/**
 * @author Ricardo Delgado
 */
function FieldsEdit() {

    this.objects = {
            row1 : {
                div : null,
                buttons : [],
                y : 10
            },
            row2 : {            
                div : null,
                buttons : [],
                y : 30
            },
            tile : { 
                mesh : null,
                target : {}
            },
            idFields : {}
        };

    this.actions = { 
        exit : null,
        type : null
    };

    this.actualTile = null;

    this.actualFlow = null;

    var self = this;

    var DATA_USER = window.helper.listDevs;

    var button,
        text,
        x,
        type;

    this.removeAllFields = function(){

        if(self.objects.row1.buttons.length !== 0 || self.objects.row2.buttons.length !== 0){

            var row = 'row1';

            if(self.objects[row].buttons.length === 0)
                row = 'row2';

            var actualButton = self.objects[row].buttons.shift();

            if( $('#'+actualButton.id) != null ) 
                window.helper.hide($('#'+actualButton.id), 1000); 
            
                self.removeAllFields();
        }
        else {

            if( $('#'+self.objects.row1.div) != null ) 
                window.helper.hide($('#'+self.objects.row1.div), 1000);

            if( $('#'+self.objects.row2.div) != null ) 
                window.helper.hide($('#'+self.objects.row2.div), 1000);

            self.objects.row1.div = null;
            self.objects.row2.div = null;
            self.objects.idFields = {};

            if(document.getElementById("hidden-area"))
                window.helper.hide('hidden-area', 1000);

            if(window.actualView === 'table'){ 

                self.actualTile = null;
                
                window.tableEdit.deleteMesh();

                if(window.camera.getFocus() === null)
                    window.tableEdit.addButton();              

                if(typeof(self.actions.exit) === 'function'){
                    self.actions.exit();
                    self.actions.exit = null;
                }
            }
            else if(window.actualView === 'workflows'){
                    
                self.actualFlow = null;
                    
                window.tableEdit.deleteMesh();

                if(window.camera.getFocus() === null)
                    window.workFlowEdit.addButton();              

                if(typeof(self.actions.exit) === 'function'){
                    self.actions.exit();
                    self.actions.exit = null;
                }
            }

        }
    };

    this.createField = function(id, text, _x, _type, _row){

        var object = {
            id : id,
            text : text
          };

        var x = _x || 5,
            type = _type || 'button',
            idSucesor = "backButton",
            row = _row || '1';

        if( self.objects['row' + row].div === null)
            self.createDiv(row);

        if(self.objects['row' + row].buttons.length !== 0)
            idSucesor = self.objects['row' + row].buttons[self.objects['row' + row].buttons.length - 1].id;

        var div = document.getElementById(self.objects['row' + row].div);

        var button = document.createElement(type),
            sucesorButton = document.getElementById(idSucesor);
                  
        button.id = id;
        button.className = 'edit-Fermat';
        button.innerHTML = text;
        button.style.zIndex = 10;
        button.style.opacity = 0;

        div.appendChild(button);

        self.objects['row' + row].buttons.push(object);

        window.helper.show(button, 1000);

        return button;
    };

    this.createDiv = function(row){ 

        var div = document.createElement('div');

        div.id = 'div-Edit' + row;

        document.body.appendChild(div);

        self.objects['row' + row].div = 'div-Edit' + row;

        window.helper.show(div, 1000);
    };

    this.setTextSize = function() { 
        
        var object = {
            id : "fermatEditStyle",
            text : "style"
          };

        self.objects.row2.buttons.push(object);

        var windowWidth  = window.innerWidth;
        var size         = windowWidth * 0.009;
        var style        = document.createElement("style");
        var styleSheet   = ".edit-Fermat {font-size:"+size+"px;}";
        var node         = document.createTextNode(styleSheet);
        
        style.appendChild(node);
        document.body.appendChild(style);  
    };

    this.createFieldTableEdit = function(){

        sesionGroup();
        sesionType();
        sesionName();
        sesionRepoDir();
        sesionDifficulty();
        sesionDescription();
        sesionState();
        sesionAuthor();
        createbutton(function(){
            self.actions.exit = null;
            window.tableEdit.saveTile();  
        });
        self.setTextSize();

    };

    this.createFieldWorkFlowEdit = function(){

        workflowHeader();
        workflowDescription();
        workflowModalSteps();

        createbutton(function(){
            self.actions.exit = null;
            window.workFlowEdit.save();  
        });

    };

    this.changeLayer = function(platform){

        var state = false;

        if(typeof window.platforms[platform] === 'undefined')
            state = platform;

        var _layers = window.CLI.query(window.layers,function(el){return (el.super_layer === state);});

        var option = "";

        for(var i = 0;i < _layers.length; i++){

            option += "<option value = '"+_layers[i]+"' >"+_layers[i]+"</option>";

        }

        $("#select-layer").html(option);  
        
    };

    this.disabledButtonSave = function(state){

        var button = document.getElementById('button-save');

        if(state){
            button.innerHTML  = "Saving...";
            button.disabled=true;
        }
        else{
            button.innerHTML  = "Save";
            button.disabled=false;
        }
    };
    
    this.getData = function() {
        
        var title = document.getElementById("workflow-header-title");
        var desc = document.getElementById("modal-desc-textarea");
        var platform = document.getElementById("workflow-header-plataform");
        var list = document.getElementById("step-List");
        
        var json = {
            "platfrm": platform.value,
            "name": title.value,
            "desc": desc.value,
            "prev": null,
            "next": null,
            "steps": list.valueJson.slice()
        };
        
        return json;
    };

        
    function sesionRepoDir() {

        var id = 'label-Repositorio'; text = 'Dir. Repo. : '; type = 'label';

        self.createField(id, text, null, type, 2);

        var idSucesor = self.objects.row2.buttons[self.objects.row2.buttons.length - 1].id;

        var object = {
            id : "input-repodir",
            text : "textfield"
          };

        self.objects.idFields.repo = object.id;

        var input = $('<input />', {"id" : object.id, "type" : "text", "text" : object.text });

        $("#"+self.objects.row2.div).append(input);

        var button = document.getElementById(object.id);

        var sucesorButton = document.getElementById(idSucesor);
              
        button.className = 'edit-Fermat';
        button.placeholder = 'Directory of repository';
        button.style.zIndex = 10;
        button.style.opacity = 0;

        window.helper.show(button, 1000);

        self.objects.row2.buttons.push(object);

        button.addEventListener('blur', function() {
            window.tableEdit.changeTexture();
        });

    }
    
    function setSelectImages(select) {
        
        select.style.backgroundSize = select.offsetHeight + "px";
        select.style.width = select.offsetWidth + select.offsetHeight + "px";
        
    }

    function sesionGroup(){

        var id = 'label-Group'; text = 'Select the Group : '; type = 'label';

        self.createField(id, text, null, type);

        id = 'select-Group'; text = ''; type = 'select';

        self.createField(id, text, null, type);

        var optgroup = "<optgroup label = Platform>",
            option = "";

        self.objects.idFields.group = id;

        for(var i in window.platforms){ 

            if(i != "size"){

                option += "<option value = "+i+" >"+i+"</option>";
            }

        }

        optgroup += option + "</optgroup>";

        option = "";

        optgroup += "<optgroup label = superLayer>";

        for(var _i in window.superLayers){

            if(_i != "size"){

                option += "<option value = "+_i+" >"+_i+"</option>";
            }

        }

        optgroup += option + "</optgroup>";

        $("#"+id).html(optgroup);

        sesionLayer();

        self.changeLayer(document.getElementById(id).value);

       $("#"+id).change('click', function() {
        
            self.changeLayer(document.getElementById(id).value);
            window.tableEdit.changeTexture();
        });
        
        setSelectImages(document.getElementById(id));
    }

    function sesionLayer(){

        var id = 'label-layer'; text = 'Select the Layer : '; type = 'label';

        self.createField(id, text, 15, type);

        id = 'select-layer'; text = ''; type = 'select';

        self.createField(id, text, null, type);

        self.objects.idFields.layer = id;

        $("#"+id).change('click', function() {
        
            window.tableEdit.changeTexture();
        });
        
        setSelectImages(document.getElementById(id));
    }

    function sesionType(){

        var id = 'label-Type'; text = 'Select the Type : '; type = 'label';

        self.createField(id, text, 15, type);

        id = 'select-Type'; text = ''; type = 'select';

        self.createField(id, text, null, type);

        self.objects.idFields.type = id;        

        var option = "";

        option += "<option value = Addon>Addon</option>";
        option += "<option value = Android>Android</option>";
        option += "<option value = Library>Library</option>";
        option += "<option value = Plugin>Plugin</option>";

        $("#"+id).html(option);

        $("#"+id).change('click', function() {
        
            window.tableEdit.changeTexture();
        });
        
        setSelectImages(document.getElementById(id));

    }

    function sesionName(){

        var id = 'label-Name'; text = 'Enter Name : '; type = 'label';

        self.createField(id, text, null, type, 2);

        var idSucesor = self.objects.row2.buttons[self.objects.row2.buttons.length - 1].id;

        var object = {
            id : "imput-Name",
            text : "textfield"
          };

        self.objects.idFields.name = object.id;

        var imput = $('<input />', {"id" : object.id, "type" : "text", "text" : object.text });

        $("#"+self.objects.row2.div).append(imput);

        var button = document.getElementById(object.id);

        var sucesorButton = document.getElementById(idSucesor);
              
        button.className = 'edit-Fermat';
        button.placeholder = 'Component Name';
        button.style.zIndex = 10;
        button.style.opacity = 0;

        window.helper.show(button, 1000);

        self.objects.row2.buttons.push(object);

        button.addEventListener('blur', function() {

            window.tableEdit.changeTexture();
        });

    }
    
    function sesionAuthor(){
        
        var idSucesor = self.objects.row2.buttons[self.objects.row2.buttons.length - 1].id;

        var object = {
            id : "button-author",
            text : "button"
        };
        
        self.objects.idFields.author = object.id;

        var input = $('<input />', {"id" : object.id, "type" : "button", "text" : object.text });

        $("#"+self.objects.row2.div).append(input);

        self.objects.row2.buttons.push(object);
        
        var button = document.getElementById(object.id);
        
        button.className = 'actionButton edit-Fermat';
        button.style.zIndex = 10;
        button.style.opacity = 0;
        button.value = "Autores";
        button.style.marginLeft = "5px";

        object = {
            id : "modal-devs",
            text : "modal"
        };

        self.objects.row2.buttons.push(object);
        
        // Modal
        // START
        
        if(!document.getElementById("modal-devs")){
            
            var modal = document.createElement("div");
            modal.id            = "modal-devs";
            modal.style.left    = (window.innerWidth/2-227)+"px";
            modal.style.top     = (window.innerHeight/2-186)+"px";
            modal.value         = [];
            
            modal.innerHTML = '<div id="a">'+
                    '<div id="finder">'+
                        '<input id="finder-input" type="text" placeholder="Buscar"></input>'+
                        '<input id="finder-button" type="button" value=""></input>'+
                    '</div>'+
                    '<div id="list">'+
                        '<div id="cont-devs" class="list-content">'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div id="b">'+
                    '<div id="list">'+
                        '<div id="cont-devs-actives" class="list-content">'+
                        '</div>'+
                    '</div>'+
                    '<div id="buttons" >'+
                        '<button id="modal-close-button" >Cancel</button>'+
                        '<button id="modal-accept-button" style="border-left: 2px solid #00b498;">Aceptar</button>'+
                    '</div>'+
                '</div>';
            
            modal.updateModal = function() {
                
                var cont_list = document.getElementById("cont-devs");
                cont_list.innerHTML = "";
                
                var finder = document.getElementById("finder-input");
                
                for(var i = 0; i < DATA_USER.length; i++) {
                    
                    var filt = DATA_USER[i].usrnm.search(finder.value);
                    
                    if(filt != -1) {
                    
                        var img_src;

                        if(DATA_USER[i].avatar_url)
                            img_src = DATA_USER[i].avatar_url;
                        else
                            img_src = "images/modal/avatar.png";

                        var usr_html  = '<div class="dev-fermat-edit">'+
                                            '<div>'+
                                                '<img crossorigin="anonymous" src="'+img_src+'">'+
                                                '<label>'+DATA_USER[i].usrnm+'</label>'+
                                                '<button data-usrid="'+DATA_USER[i].usrnm+'" class="add_btn"></button>'+
                                            '</div>'+
                                        '</div>';

                        cont_list.innerHTML += usr_html;
                        
                    }
                }
                
                var list_btn = document.getElementsByClassName("add_btn");
                
                function btnOnclickAccept() {
                        
                        var modal = document.getElementById("modal-devs");
                        var _self = this;
                        modal.value[modal.value.length] = {
                            dev: DATA_USER.find(function(x) {
                                
                                if(x.usrnm == _self.dataset.usrid)
                                    return x;
                                
                            }),
                            scope: "implementation",
                            role: "author",
                            percnt: 100
                        };
                        
                        modal.updateModal();

                }

                
                for(i = 0; i < list_btn.length; i++) {
                    var btn = list_btn[i];

                    btn.onclick = btnOnclickAccept;
                }
                
                cont_list = document.getElementById("cont-devs-actives");
                cont_list.innerHTML = "";
                
                for(i = 0; i < this.value.length; i++) {
                    
                    var img_src1;
                    
                    if(this.value[i].dev.avatar_url)
                        img_src1 = this.value[i].dev.avatar_url;
                    else
                        img_src1 = "images/modal/avatar.png";
                    
                    var dev_html = ''+
                    '<div data-expand="false" data-usrid='+ i +' class="dev-fermat-edit dev-active">'+
                        '<div>'+
                            '<img crossorigin="anonymous" src="' + img_src1 + '">'+
                            '<label>' + this.value[i].dev.usrnm + '</label>'+
                            '<button data-usrid='+ i +' class="rem_btn"></button>'+
                            '<div class="dev-data">'+
                                '<table width="100%">'+
                                    '<tr>'+
                                        '<td align="right">Scope</td>'+
                                        '<td>'+
                                            '<select class="select-scope">'+
                                                '<option>implementation</option>'+
                                                '<option>architecture</option>'+
                                                '<option>design</option>'+
                                                '<option>unit-tests</option>'+
                                            '</select>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                       '<td align="right">Role</td>'+
                                        '<td>'+
                                            '<select class="select-role">'+
                                                '<option>maintainer</option>'+
                                                '<option>author</option>'+
                                            '</select>'+
                                       '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td align="right">%</td>'+
                                        '<td><input class="input-prcnt" type="text" value="` + this.value[i].percnt + `"></input></td>'+
                                    '</tr>'+
                                '</table>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                    
                    cont_list.innerHTML += dev_html;
                    
                    
                }
                
                var devDiv = document.getElementsByClassName("dev-active");

                for(i=0; i < devDiv.length; i++) {

                    var div = devDiv[i];
                    var dev     = modal.value[div.dataset.usrid];
                    
                    var role    = div.getElementsByClassName("select-role")[0];
                    var scope   = div.getElementsByClassName("select-scope")[0];
                    var prc     = div.getElementsByClassName("input-prcnt")[0];
                    prc.value   = dev.percnt;
                    scope.value = dev.scope;
                    role.value  = dev.role;
                    
                }
                
                list_btn = document.getElementsByClassName("rem_btn");
                
                function btnOnclickRemove() {

                    var modal = document.getElementById("modal-devs");
                    modal.value.splice(this.dataset.usrid, 1);
                    modal.updateModal();

                }
                
                for(i = 0; i < list_btn.length; i++) {
                    var btn1 = list_btn[i];

                    btn1.onclick = btnOnclickRemove;

                }
                
                var list_dev = document.getElementsByClassName("dev-active");
                
                
                function dev_onmouseout() {
                    this.dataset.expand = "false";

                    var selectRole = this.getElementsByClassName("select-role")[0].value;
                    var selectScope = this.getElementsByClassName("select-scope")[0].value;
                    var inputPrcnt = this.getElementsByClassName("input-prcnt")[0].value;

                    modal.value[this.dataset.usrid].role = selectRole;
                    modal.value[this.dataset.usrid].scope = selectScope;
                    modal.value[this.dataset.usrid].percnt = inputPrcnt;
                }
                
                function dev_onmouseover() {
                    this.dataset.expand = "true";
                }
                
                for(i = 0; i < list_dev.length; i++) {
                    var dev1 = list_dev[i];

                    dev1.onmouseover = dev_onmouseover;
                    
                    dev1.onmouseout = dev_onmouseout;

                }
                
            };
            
            document.body.appendChild(modal);

            var finder = document.getElementById("finder-input");

            finder.onkeyup = function() {
                
                document.getElementById("modal-devs").updateModal();
                
            };

            
        }
        
        
        // END
        

        button.addEventListener('click', function() {
            
            var modal = document.getElementById("modal-devs");
            modal.dataset.state = "show";
            modal.updateModal();
            var area = document.createElement("div");
            area.id = "hidden-area";
            document.body.appendChild(area);
            window.helper.show(area, 1000);
            
        });
        
        document.getElementById("modal-close-button").addEventListener("click", function() {
            
            var modal = document.getElementById("modal-devs");
            modal.dataset.state = "hidden";
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            window.tableEdit.changeTexture();
            
        });
        
        document.getElementById("modal-accept-button").addEventListener("click", function() {
            
            var modal = document.getElementById("modal-devs");
            modal.dataset.state = "hidden";
            
            //update data of devs (modal.value)
            
            var devDiv = document.getElementsByClassName("dev-active");
            
            for(var i=0; i < devDiv.length; i++) {
                
                var div = devDiv[i];
                
                var selectRole = div.getElementsByClassName("select-role")[0].value;
                var selectScope = div.getElementsByClassName("select-scope")[0].value;
                var inputPrcnt = div.getElementsByClassName("input-prcnt")[0].value;

                modal.value[div.dataset.usrid].role = selectRole;
                modal.value[div.dataset.usrid].scope = selectScope;
                modal.value[div.dataset.usrid].percnt = inputPrcnt;
                
            }
            
            //---------------------------------
            
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            window.tableEdit.changeTexture();
            
        });

        window.helper.show(button, 1000);
    }

    function sesionDifficulty(){

        var id = 'label-Difficulty'; text = 'Select Difficulty : '; type = 'label';

        self.createField(id, text, 15, type);

        id = 'select-Difficulty'; text = ''; type = 'select';

        self.createField(id, text, null, type);

        self.objects.idFields.difficulty = id;

        var option = "";

        option += "<option value = 0>0</option>";
        option += "<option value = 1>1</option>";
        option += "<option value = 2>2</option>";
        option += "<option value = 3>3</option>";
        option += "<option value = 4>4</option>";
        option += "<option value = 5>5</option>";
        option += "<option value = 6>6</option>";
        option += "<option value = 7>7</option>";
        option += "<option value = 8>8</option>";
        option += "<option value = 9>9</option>";
        option += "<option value = 10>10</option>";

        $("#"+id).html(option);

        $("#"+id).change('click', function() {
        
            window.tableEdit.changeTexture();
        });
        
        setSelectImages(document.getElementById(id));

    }

    function sesionDescription(){
        
        var idSucesor = self.objects.row2.buttons[self.objects.row2.buttons.length - 1].id;

        var object = {
            id : "button-desc",
            text : "Description"
          };

        self.objects.idFields.maintainer = object.id;

        var input = $('<input />', {"id" : object.id, "type" : "button", "text" : object.text });

        $("#"+self.objects.row2.div).append(input);

        var button = document.getElementById(object.id);
        
        button.className = 'actionButton edit-Fermat';
        button.value = "Description";
        button.style.marginLeft = "5px";
        button.style.zIndex = 10;
        button.style.opacity = 0;
        
        self.objects.row2.buttons.push(object);

        object = {
            id : "modal-desc",
            text : "modal"
        };

        self.objects.row2.buttons.push(object);
        

        window.helper.show(button, 1000);
        
        if(!document.getElementById("modal-desc")) {
            
            var modal = document.createElement("div");
            modal.id = "modal-desc";
            modal.style.top = (window.innerHeight / 4) + "px" ;
            modal.dataset.state = "hidden";
            
            modal.innerHTML = ''+
                    '<label>Description:</label>'+
                    '<textarea id="modal-desc-textarea" rows="12"></textarea>'+
                    '<div>'+
                        '<button id="modal-desc-cancel">Cancel</button>'+
                        '<button id="modal-desc-accept">Accept</button>'+
                    '</div>';
            
            
            
            document.body.appendChild(modal);
        }


        button.addEventListener('click', function() {
            
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "show";
            
            modal.oldValue = document.getElementById("modal-desc-textarea").value;
            
            var area = document.createElement("div");
            area.id = "hidden-area";
            document.body.appendChild(area);
            window.helper.show(area, 1000);
            
        });
        
        document.getElementById("modal-desc-cancel").onclick = function() {
            
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "hidden";
            document.getElementById("modal-desc-textarea").value = modal.oldValue;
            
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            
        };
        
        document.getElementById("modal-desc-accept").addEventListener("click", function() {
            
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "hidden";
            
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            
        });

    }

    function sesionState(){

        var id = 'label-State'; text = 'Select the State : '; type = 'label';

        self.createField(id, text, 15, type);

        id = 'select-State'; text = ''; type = 'select';

        self.createField(id, text, 8, type);

        self.objects.idFields.state = id;

        var option = "";

        option += "<option value = concept>Concept</option>";
        option += "<option value = development>Development</option>";
        option += "<option value = production>Production</option>";
        option += "<option value = qa>QA</option>";

        $("#"+id).html(option);

        $("#"+id).change('click', function() {
        
            window.tableEdit.changeTexture();
        });
        
        setSelectImages(document.getElementById(id));

    }

    function createbutton(callback){
        
        var id = 'button-save', text = 'Save', type = 'button';
        
        window.buttonsManager.createButtons(id, text, function(){

            if(typeof(callback) === 'function')
                callback();          

        }, null, null, "right");

    }

    function deleteMesh(){

        var mesh = self.objects.tile.mesh;

        if(mesh != null){ 

            animate(mesh, self.objects.tile.target.hide, 1500, function(){ 
                    window.scene.remove(mesh);
                    
                    self.objects.tile.mesh = null;
                });
        }
    }

    function workflowHeader() {
        
        if(!document.getElementById("workflow-header")) {
            
            var div = document.createElement("div");
            div.id = "workflow-header";
            div.innerHTML += '<label> Title: </label>';
            div.innerHTML += '<input id="workflow-header-title" class="edit-Fermat" placeholder="Title" type="text"></input>';
            div.innerHTML += '<label> Plataform: </label>';
            var select = document.createElement("select");
            select.id = "workflow-header-plataform";
            select.className = "edit-Fermat";

            var object = {
                id : "workflow-header",
                text : "workflow-header"
            };

            self.objects.row1.buttons.push(object);
  
            var optgroup = "<optgroup label = Platform>",
            option = "";

            for(var i in window.platforms){ 

                if(i != "size"){

                    option += "<option value = "+i+" >"+i+"</option>";
                }

            }

            optgroup += option + "</optgroup>";

            option = "";

            optgroup += "<optgroup label = superLayer>";

            for(var _i in window.superLayers){

                if(_i != "size"){

                    option += "<option value = "+_i+" >"+_i+"</option>";
                }

            }

            optgroup += option + "</optgroup>";

            select.innerHTML = optgroup;
            
            
            div.appendChild(select);
            
            div.innerHTML += '<input id="workflow-header-description" style="margin-left: 5px" type="button" class="actionButton edit-Fermat" value="Description"></input>';
            div.innerHTML += '<input id="workflow-header-steps" style="margin-left: 5px" type="button" class="actionButton edit-Fermat" value="Steps"></input>';
            
            document.body.appendChild(div);
            
            document.getElementById("workflow-header-title").addEventListener('blur', function() {
               window.workFlowEdit.changeTexture();
            });
            
            setSelectImages(document.getElementById("workflow-header-plataform"));
        }
        
    }
    
    function workflowDescription() {

        var div = document.createElement("div");
        div.id = "workflow-modal-desc";
        var modal = document.createElement("div");
        modal.id = "modal-desc";
        modal.style.top = (window.innerHeight / 4) + "px" ;
        modal.dataset.state = "hidden";

        var object = {
            id : "workflow-modal-desc",
            text : "workflow-header"
        };

        self.objects.row1.buttons.push(object);

        modal.innerHTML = ''+
            '<label>Description:</label>'+
            '<textarea id="modal-desc-textarea" rows="12"></textarea>'+
            '<div>'+
                '<button id="modal-desc-cancel">Cancel</button>'+
                '<button id="modal-desc-accept">Accept</button>'+
            '</div>';
        
        div.appendChild(modal);
        document.body.appendChild(div);
        
        var button = document.getElementById("workflow-header-description");
        
        button.addEventListener('click', function() {
            
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "show";
            
            modal.oldValue = document.getElementById("modal-desc-textarea").value;
            
            var area = document.createElement("div");
            area.id = "hidden-area";
            document.body.appendChild(area);
            window.helper.show(area, 1000);
            
        });
        
        document.getElementById("modal-desc-cancel").onclick = function() {
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "hidden";
            document.getElementById("modal-desc-textarea").value = modal.oldValue;
            
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            
        };
        
        document.getElementById("modal-desc-accept").addEventListener("click", function() {
            var modal = document.getElementById("modal-desc");
            modal.dataset.state = "hidden";
            
            var area = document.getElementById("hidden-area");
            window.helper.hide(area, 500);
            
            window.workFlowEdit.changeTexture();
        });
    }
    
    function workflowModalSteps() {
        
        //create modal
        
        if(!document.getElementById("modal-steps")) {

            var modal = document.createElement("div");
            modal.id = "modal-steps-div";
            modal.dataset.state = "hidden";
            modal.innerHTML = `
                <div id="modal-steps">
                    <div id="left">
                        <span id="step-Number">Step 1:</span>
                        <div>
                            <label>Title:</label>
                            <input id="step-Title" type="text" placeholder="Title of Step"/>
                            <label>Plataform:</label>
                            <select id="step-Plataform">
                            </select>
                            <label>Layer:</label>
                            <select id="step-Layer">
                            </select>
                            <label>Component:</label>
                            <select id="step-Component">
                            </select>
                            <label>Next:</label>
                            <select id="step-Padre">
                            </select>
                            <label>Type Call:</label>
                            <select id="step-TypeCall">
                            </select>
                            <label id="desc" >Description:</label>
                            <textarea id="step-Description"></textarea>
                        </div>
                    </div>
                    <div id="right">
                        <span>Preview:</span>
                        <canvas id="step-Preview"></canvas>
                        <span>Select step:</span>
                        <select id="step-List" size="5">
                        </select>
                        <button id="step-NewStep">New Step</button>
                        <button id="step-RemoveStep">Remove Step</button>
                        <button id="step-Cancel" style="margin-left: 0.5%;">Cancel</button>
                        <button id="step-Accept" style="margin-left: 0.5%;">Update</button>
                    </div>
                </div>
            `;

            var object = {
                id : "modal-steps-div",
                text : "workflow-header"
            };

            self.objects.row1.buttons.push(object);     
            
            /*
                step-Number
                step-Title
                step-Layer
                step-Plataform
                step-Component
                step-Padre
                step-Description
                step-List
                step-TypeCall
                
                buttons:
                    step-NewStep
                    step-RemoveStep
                    step-Accept
                    step-Cancel
                
                canvas:
                    step-Preview
                
                (id:step-List) .valueJson = [];
            */

            document.body.appendChild(modal);
            
            var nTitle       = document.getElementById("step-Title");
            var nLayer       = document.getElementById("step-Layer");
            var nPlataform   = document.getElementById("step-Plataform");
            var nComponent   = document.getElementById("step-Component");
            var nPadre       = document.getElementById("step-Padre");
            var nDescription = document.getElementById("step-Description");
            var nTypeCall    = document.getElementById("step-TypeCall");
            var list         = document.getElementById("step-List");
            
            list.update = function() {

                var opt;
                
                this.innerHTML = "";
                
                for(var i = 0; i < this.valueJson.length; i++) {
                    opt = document.createElement("option");
                    opt.value = i;
                    opt.innerHTML = (i + 1) + " - " + this.valueJson[i].title;
                    this.appendChild(opt);
                }
                
            };
            
            nLayer.update = function() { 

                var nPlataform = document.getElementById("step-Plataform");

                var _layers = TABLE[nPlataform.value].layers;

                var option = "";

                for(var layer in _layers){
                    option += "<option value = '" + layer + "' >" + layer + "</option>";
                }
                
                nLayer.innerHTML = option;

                list.valueJson[nLayer.step].layer = nLayer.value;

            };
            
            nComponent.update = function() {

                var nPlataform = document.getElementById("step-Plataform");
                var nLayer     = document.getElementById("step-Layer");
                var obj = TABLE[nPlataform.value].layers[nLayer.value].objects.slice();

                var option = "";
                
                for(var i = 0; i < obj.length; i++) {
                    option += "<option value='" + obj[i].data.name + "'>" + obj[i].data.name + "</option>";
                }

                this.innerHTML = option;

                list.valueJson[nComponent.step].name = nComponent.value;
            };
            
            nDescription.onkeyup = function() {
                list.valueJson[nDescription.step].desc = nDescription.value;
            };
            
            nTitle.onkeyup = function() {
                list.valueJson[nTitle.step].title = nTitle.value;
                list.update();
            };
            
            nLayer.onchange = function() {
                list.valueJson[nLayer.step].layer = nLayer.value;

                nComponent.update();
            };
            
            nPlataform.onchange = function() {
                list.valueJson[nPlataform.step].platfrm = nPlataform.value;

                nLayer.update();
                nComponent.update();
            };
            
            nTypeCall.onchange = function() {
                list.valueJson[nTypeCall.step].next[0].type = nTypeCall.value;
            };
            
            nComponent.onkeyup = function() {
                list.valueJson[nComponent.step].name = nComponent.value;
            };
            
            nPadre.onchange = function() {
                if(nPadre.value != "Null") {
                    list.valueJson[nPadre.step].next[0] = {
                        "type": "direct call",
                        "id": nPadre.value
                    };
                    nTypeCall.disabled = false;
                } else {
                    list.valueJson[nPadre.step].next = [];
                    nTypeCall.disabled = true;
                }
            };
            
            list.valueJson = [];
            
            list.onchange = function() {
                var modal = document.getElementById("modal-steps-div");
                modal.changeStep(parseInt(list.value));
            };
            
            modal.getStepData = function() {
                for(var i=0; i < list.valueJson.length; i++) {
                    list.valueJson[i].type = "activity";
                }
                                
                list.valueJson[0].type = "start";
                list.valueJson[list.valueJson-1].type = "end";
                
                return list.valueJson.slice();
            };
            
            modal.previewUpdate = function(Step) {
                
            };
            
            modal.changeStep = function(Step) {

                var nTitle       = document.getElementById("step-Title");
                var list         = document.getElementById("step-List");
                var nStep        = document.getElementById("step-Number");
                var nLayer       = document.getElementById("step-Layer");
                var nPlataform   = document.getElementById("step-Plataform");
                var nComponent   = document.getElementById("step-Component");
                var nPadre       = document.getElementById("step-Padre");
                var nDescription = document.getElementById("step-Description");
                var nTypeCall    = document.getElementById("step-TypeCall");
                var step         = list.valueJson[Step];
                
                nLayer.step = Step;
                nPlataform.step = Step;
                nComponent.step = Step;
                nPadre.step = Step;
                nDescription.step = Step;
                nTitle.step = Step;
                nTypeCall.step = Step;

                nTitle.innerHTML = "Step " + (step.id + 1) + ":";
                
                //----------Type Call-----------
                
                nTypeCall.innerHTML = "";
                
                if(nPadre.value != "NULL"){
                    nTypeCall.innerHTML += '<option value="direct call" >direct call</option>';
                    nTypeCall.innerHTML += '<option value="fermat message" >fermat message</option>';
                    nTypeCall.innerHTML += '<option value="event" >event</option>';
                    nTypeCall.disabled = false;
                } else {
                    nTypeCall.disabled = true;
                }
                
                
                //------------List--------------
                
                list.update();
                list.value = Step;
                
                //----------Plataform-----------
                
                var optgroup = "<optgroup label = Platform>",
                option = "";

                for(var i in window.platforms){ 
                    if(i != "size"){
                        option += "<option value = "+i+" >"+i+"</option>";
                    }
                }

                optgroup += option + "</optgroup>";
                option = "";
                optgroup += "<optgroup label = superLayer>";

                for(var _i in window.superLayers){
                    if(_i != "size"){
                        option += "<option value = "+_i+" >"+_i+"</option>";
                    }
                }

                optgroup += option + "</optgroup>";
                
                nPlataform.innerHTML = optgroup;
                
                if(step.platfrm){

                    nPlataform.value = step.platfrm;
                }
                else{

                    nPlataform.selectedIndex = 0;
                    list.valueJson[nPlataform.step].platfrm = nPlataform.value;
                }
                
                nLayer.update();

                if(step.layer)
                    nLayer.value = step.layer;
                else
                    nLayer.selectedIndex = 0;
                
                nComponent.update();

                if(step.name)
                    nComponent.value = step.name;
                else
                    nComponent.selectedIndex = 0;
                
                //------------Padre-------------
                
                nPadre.innerHTML = "";

                var opt = document.createElement("option");
                opt.innerHTML = "None";
                opt.value = "Null";
                nPadre.appendChild(opt);
                
                for(i=0; i < list.valueJson.length; i++){
                    opt = document.createElement("option");
                    opt.innerHTML = ( i + 1) + " - " + list.valueJson[i].title;
                    opt.value = i;
                    nPadre.appendChild(opt);
                }
                
                //------------------------------
                
                nTitle.value = step.title;
                nStep.value = "Step " + step.id + ":";
                nDescription.value = step.desc;

                if(step.next[0]) 
                    nPadre.value = step.next[0].id;
                else 
                    nPadre.value = "Null";

                if(step.next[0]) {
                    nTypeCall.disabled = false;
                    nTypeCall.value = step.next[0].type;
                } else nTypeCall.disabled = true;
            };
            
            modal.newStep = function() {
                var list = document.getElementById("step-List");
                var num  = list.valueJson.length;
                list.valueJson[list.valueJson.length] = {
                    "id": num,
                    "title": "",
                    "desc": "",
                    "type": "start",
                    "next": []
                };
                
                list.update();
                
                return num;
            };
        
        }
        
        var button = document.getElementById("workflow-header-steps");
        
        button.addEventListener('click', function() {
            
            var modal = document.getElementById("modal-steps-div");
            modal.dataset.state = "show";
            
            var area = document.createElement("div");
            area.id = "hidden-area";
            document.body.appendChild(area);
            window.helper.show(area, 1000);
            
        });
        
        document.getElementById("step-NewStep").onclick = function() {
            var modal = document.getElementById("modal-steps-div");
            var list = document.getElementById("step-List");
            var num  = modal.newStep();
            list.value = num;
            modal.changeStep(num);
        };
        
        document.getElementById("step-RemoveStep").onmouseup = function() {
            var modal = document.getElementById("modal-steps-div");
            var list = document.getElementById("step-List");
            
            var value = list.value;
            var high = list.valueJson.splice(0, list.value);
            var low  = list.valueJson.splice(1, list.valueJson.length);
            list.valueJson = high.concat(low);
            
            for(var i = 0; i < list.valueJson.length; i++) {
                list.valueJson[i].id = i;
            }
            
            if(value > list.valueJson.length - 1)
                list.value = list.valueJson.length - 1;
            else
                list.value = value;
            
            modal.changeStep(list.value);
            
        };
        
        document.getElementById("step-Accept").onclick = function() {

            if(validateNameSteps() === ''){ 

            var modal = document.getElementById("modal-steps-div");
            modal.dataset.state = "hidden";
            
            area = document.getElementById("hidden-area");
            window.helper.hide(area, 1000);
            window.workFlowEdit.changeTexture();
            window.workFlowEdit.fillStep();

            }
            else{
                window.alert(validateNameSteps());
            }
        };

        function validateNameSteps(){

            var list = document.getElementById("step-List");

            var msj = '';

            if(list.valueJson.length > 0){
            
                for(var i = 0; i < list.valueJson.length; i++) {
    
                    var name = list.valueJson[i].title;

                    console.log(name);
    
                    if(name === "")
                        msj += 'The step '+ (i + 1) +' must have a name. \n';
                }
            }

            return msj;
        } 
    }
    
}