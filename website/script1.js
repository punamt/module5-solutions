$(function () { //same as document.addeventlistener("DOMContentLoaded")
//same as document.querySelector("#navbarToggle").addEventListener("blur")
$("#navbarToggle").blur(function (event){
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        $("#collapsable-nav").collapse('hide');
    }
   });

});                              

(function(global) {
  
    var dc = {};
    var homeHtml="home-snippet.html";
    var allCategoriesUrl="http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml="category-title-snippet.html";
    var categoryHtml ="category-snippet.html";
    ///today
    var menuItemUrl ="http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemTitleHtml = "menu-items-title.html";
    var menuItemHtml = "menu-item.html";

    //convinience function for inserting innerHtml for 'select'
     var insertHtml= function(selector,html){
     var targetElem = document.querySelector(selector);
       targetElem.innerHTML=html; 
     };

     //showloading inside element identified by selector
     var showLoading = function(selector){
        var html="<div class='text-center'>";
        html += "img src='image/ajex-loader.gif'></div>";
        insertHtml(selector,html);
     };     
     
     //return substitute of '{{propname}}'
      //with prop value in given 'string'
      var insertProperty= function (string, propName, propValue) {
        var propToReplace="{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace,"g"),propValue);
        return string;
    }
     
     //on page load before images or css
     document.addEventListener("DOMContentLoaded", function(event) {
        //on first load show home view
       showLoading("#main-content");
       $ajaxUtils.sendGetRequest( homeHtml, function(responseText){
        document.querySelector("#main-content").innerHTML=responseText;
        
    }, false);

   });
      

     

    //load the menu categories view
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl,buildAndShowCategoriesHtml);
        
    };

    ///today
     //load the menu item view
       dc.loadMenuItems = function (categoryShort) {
         showLoading("#main-content");
         $ajaxUtils.sendGetRequest(menuItemUrl + categoryShort,buildAndShowMenuItemsHtml);
   };


    //builds HTML for the categories page based on the data from the server
    function buildAndShowCategoriesHtml(categories){
       //load title snippet of category page
        $ajaxUtils.sendGetRequest(categoriesTitleHtml,function(categoriesTitleHtml){
        //retrieve single category snippet
        $ajaxUtils.sendGetRequest(categoryHtml,function(categoryHtml){
            var categoriesViewHtml= buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
            
            insertHtml("#main-content",categoriesViewHtml);
        },
         false);
    }, 
    false);

   }  

     //builds html for single category page based on the data from server
     function buildAndShowMenuItemsHtml (categoryMenuItems){
    //load title snippet of menu item page
       $ajaxUtils.sendGetRequest(menuItemTitleHtml, function(menuItemTitleHtml){
         //retrieve single menu item snippet
         $ajaxUtils.sendGetRequest(menuItemHtml, function(menuItemHtml){
              var menuItemsViewHtml= buildMenuItemsViewHtml(categoryMenuItems,menuItemTitleHtml,menuItemHtml);
              
              insertHtml("#main-content",menuItemsViewHtml);
          
            }, false);
            
        }, false);
        
    }

   //using categories data and snippet html
   //build categories view html to be inserted into page
   function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml){

    var finalHtml=categoriesTitleHtml;
    finalHtml +="<section class='row'>";

    //loop over categories
    for(var i=0;i<categories.length;i++){ 
      var html=categoryHtml;
      var name="" + categories[i].name;
      var short_name= categories[i].short_name;
      html=insertProperty(html,"name",name);
      html=insertProperty(html,"short_name",short_name);
      finalHtml += html;
    }
      finalHtml +="</section>";
      
      return finalHtml;
   }    

 
   //using categories and menu items data and snippets html build menu item view html inserted into page
   function buildMenuItemsViewHtml(categoryMenuItems,menuItemTitleHtml,menuItemHtml){
       menuItemTitleHtml=insertProperty(menuItemTitleHtml,"name",categoryMenuItems.category.name);
       menuItemTitleHtml=insertProperty(menuItemTitleHtml,"special_instructions",
                 categoryMenuItems.category.special_instruction);
         var finalHtml= "<section class='row'>";  
         
         //loop over categories
         var menuItems = categoryMenuItems.menu_items;
         var catShortName=categoryMenuItems.category.short_name;
         // insert menu items value
         for(var i=0; i <menuItems.length; i++){
             var html=menuItemHtml;
             html=insertProperty(html,"short_name",menuItems[i].short_name);
             html=insertProperty(html,"catShortName",catShortName);
             html=insertItemPrice(html,"price_small",menuItems[i].price_small);
             html=insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
             html=insertItemPrice(html,"price_large",menuItems[i].price_large);
             html=insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
             html=insertProperty(html,"name",menuItems[i].name);
             html=insertProperty(html,"description",menuItems[i].description);
     
             //add clearfix after everysecond menu item
             if(i % 2 != 0){
                 html +="<div class='clearfix visible-lg-block visible-md-block'></div>"
             }
             finalHtml +=html;
            }
            finalHtml += "</section>";
            return finalHtml;   

        }

  //append price with $ if price exist
   function insertItemPrice(html, pricePropName,priceValue){
       //if not specified replace with empty string
       if(!priceValue){
           return insertProperty(html,pricePropName,"");
       } 
       priceValue = "$" + priceValue.toFixed(2);
       html =  insertProperty(html,pricePropName,priceValue);
       return html;
   }

   //appends portion name in parents if it exist
   function insertItemPortionName(html,portionPropName,portionValue){
           //if not specified return original string
           if(!portionValue){
            return insertProperty(html,portionPropName,"");
        
           }
           html =  insertProperty(html,portionPropName,portionValue);
          return html;
   }


     

     global.$dc = dc;


})(window);