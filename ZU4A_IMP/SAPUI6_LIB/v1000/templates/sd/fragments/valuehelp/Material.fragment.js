(function(){
    var _Table;

    sap.ui.jsfragment("fragments.valuehelp.Material", {
        createContent : function(oController) {
            var oLayout = new sap.ui.layout.VerticalLayout({width:"100%"});

            var oDialog = new sap.ui.commons.Dialog({title:"Material",width:"540px",height:"530px"});
            oDialog.addContent(this.createSearchField(oController));
            oDialog.addContent(this.createItemField(oController));

            oDialog.setModal(true);
            oDialog.addButton(new sap.ui.commons.Button({
                text: "Ok", 
                press:function(){
                    if(_Table.getSelectedRowIndex() < 0){
                        sap.ui.commons.MessageBox.alert("Please select row!");
                        return;
                    }

                    var code = _Table.getSelectedRowData()["code"];
                    var description = _Table.getSelectedRowData()["name"];

                    oDialog.data("code",code);
                    oDialog.data("description",description);
                    oDialog.close();
                }
            }));
            oDialog.addButton(new sap.ui.commons.Button({
                text: "Cancel", 
                press:function(){
                    oDialog.data("code","");
                    oDialog.data("description","");
                    oDialog.close();
                }
            }));

            return oDialog;
        },

        createSearchField : function(oController){
            jQuery.sap.require("sapui6.ui.layout.InlineForm");
            var oCode = new sap.ui.commons.TextField({width:"100px"});
            var oDesc = new sap.ui.commons.TextField({width:"100px"});
            var oSearch = new sap.ui.commons.Button({text:"Search", height:"28px", style:sap.ui.commons.ButtonStyle.Emph, press:function(){
                if(_Table.isLoading()) {
                    sap.ui.commons.MessageBox.alert("",null,"");
                    return;
                }

                _Table.showLoading();

                var code = oCode.getLiveValue();
                var desc = oDesc.getLiveValue();

                var params = "code=" + code + "&name=" + desc;

                var oModel = new sap.ui.model.json.JSONModel();
                
                oModel.attachRequestCompleted(function(){
                        _Table.setModel(oModel,"t");
                        _Table.hideLoading();
                    }
                );

                oModel.loadData("../fragments/valuehelp/Material.model.json",params,false);
            }});

            var settings = [
                    {label:"Code", element:[oCode]},
                    {label:"Description", element:[oDesc]},
                    {element:[oSearch], side:"right"}
            ];

            var oInlineForm = new sapui6.ui.layout.InlineForm({
                    width : "520px",
                    margin : "10px",
                    labelBold : true
            });

            oInlineForm.set(settings);

            return oInlineForm;
          },

        createItemField : function(oController){
            jQuery.sap.require("sapui6.ui.table.Table");

            var columns = [
                new sapui6.ui.table.Column({
                    title:"Code", path:"t>code", width:"100px", align:"center", showSortMenuEntry:true, showFilterMenuEntry:true
                }),
                new sapui6.ui.table.Column({
                    title:"Description", path:"t>name", width:"250px", align:"left", showSortMenuEntry:true, showFilterMenuEntry:true
                })
            ]

            _Table = new sapui6.ui.table.Table({
                width:"100%", 
                height:"330px",
                columns:columns,
                resize: false
                // selectionMode: "Single"
            });
            _Table.bindRows("t>/Material");

            jQuery.sap.require("sapui6.ui.layout.MarginVBox");
            var oMarginHBox = new sapui6.ui.layout.MarginVBox({
                    width : "520px",
                    marginLeft : "10px",
                    marginRight : "10px",
                    resize : false
            });

            oMarginHBox.addContent(_Table);

            return oMarginHBox;
        }
    });

}());