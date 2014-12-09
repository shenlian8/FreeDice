/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*=============================================================
// PhoneGap Functions
=============================================================*/
var app = {
    
    /*=============================================================
    // initialize
    // Application Constructor
    =============================================================*/
    initialize: function() {
        this.bindEvents();
    },

    /*=============================================================
    // bindEvents
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    =============================================================*/    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("menubutton", function(){window.location.assign('#setting');}, false);
        document.addEventListener("backbutton", this.OnBackButtonClick, false);
    },

    /*=============================================================
    // OnBackButtonClick
    =============================================================*/
    OnBackButtonClick: function() {
        if ($.mobile.activePage.is("#home"))
        {
            navigator.app.exitApp();
        } else if ($.mobile.activePage.is("#setting"))
        {
            window.location.assign('#home');
        } else
        {
            navigator.app.backHistory();
        }        
    },
        
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    /*=============================================================
    // onDeviceReady
    =============================================================*/
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    /*=============================================================
    // receivedEvent
    // Update DOM on a Received Event
    =============================================================*/    
    receivedEvent: function(id) {
        
        // DeviceReady hide the splash after 500 ms
        setTimeout(function(){navigator.splashscreen.hide();}, 500);          

        console.log('Received Event: ' + id);
    }
};

/*=============================================================
// run PhoneGap functions
=============================================================*/
app.initialize();

/*=============================================================
// define the default config
=============================================================*/
var DefaultConfig = 
    {
        'VibrationIsActive': true,
        'NavbarIsActive': true,
        'DiceFace': 
        [
            ['img0', 'img1', 'img2', 'img3', 'img4', 'img5']
        ]
    }

var Config;
var DiceFace;
var ActDice = 0;

/*=============================================================
// UI functions
=============================================================*/
var dice = {
    
    /*=============================================================
    // initialize
    // Application Constructor
    =============================================================*/    
    initialize: function() 
    {
        this.bindEvents();
        this.InitConfig();
        this.InitUI();
    },

    /*=============================================================
    // bindEvents
    =============================================================*/
    bindEvents: function() 
    {
        $('#home_content').on('tap', this.RunDice);
        $(window).bind("orientationchange resize pageshow", this.fixgeometry);
        $('#AddDice').on('tap', this.AddDice);
        $('#DelDice').on('tap', this.DelDice);
        $('#DelAll').on('tap', this.DelAll);
        $('#vib').on('click', this.SetVibration);
        $('#navbar').on('click', this.SetNavbar);
        $('#div-slider').change(this.SetCountOfDice);
        $('#0').on('tap', this.SetOneDice);
        $('.ButtonSelectGroup').on('tap', this.SelectGroup);
        $('.DiceItem').change(this.DiceItemChanged); 
        $('.AddCustomImage').on('tap', this.GetImage);  
    },

    /*=============================================================
    // InitConfig
    =============================================================*/
    InitConfig: function()
    {
        // window.localStorage.clear(); 
        var ConfigString = window.localStorage.getItem("Config");
        if (ConfigString == null) 
        {
            // alert('create new');
            window.localStorage.setItem("Config", JSON.stringify(DefaultConfig));
            ConfigString = window.localStorage.getItem("Config");
        }
        // alert(ConfigString);
        Config = JSON.parse(ConfigString);
        // Config.DiceFace[1] = Config.DiceFace[0];
        // alert(Config.DiceFace);          
    }, 

    /*=============================================================
    // InitUI
    =============================================================*/
    InitUI: function()
    {
        this.RefreshNavbar();
        
        $('#div-slider').html('<label for="CountOfDice">Count of Dice</label><input type="range" name="CountOfDice" id="CountOfDice" value="1" min="1" max="10">').trigger('create');

        $('#navbar').attr('checked', Config.NavbarIsActive); 

        $('#vib').attr('checked', Config.VibrationIsActive);

        $('#CountOfDice').attr('value', Config.DiceFace.length);

        while ($('.dice').length < Config.DiceFace.length)
        {
            this.AddOneDice();
            $('.dice').last().css('background-image', $('#' + Config.DiceFace[$('.dice').length-1][0]).css('background-image')); 
        }      
        $('#CountOfDice').val(Config.DiceFace.length).slider('refresh');

        $('.dice').first().css('background-image', $('#' + Config.DiceFace[0][0]).css('background-image'));
        
    },

    /*=============================================================
    // RefreshNavbar
    =============================================================*/
    RefreshNavbar: function()
    {
        if (Config.NavbarIsActive) 
        {
            $('#ButtonGoSetting').css({'visibility': 'hidden'});
            $('#Navbar').css({'visibility': 'visible'});
        } else
        {
            $('#ButtonGoSetting').css({'visibility': 'visible'});
            $('#Navbar').css({'visibility': 'hidden'});
        } 
    },     

    /*=============================================================
    // SetVibration
    =============================================================*/
    SetVibration: function()
    {
        Config.VibrationIsActive = $('#vib').prop("checked");
        window.localStorage.setItem("Config", JSON.stringify(Config));
        // alert(JSON.stringify(Config));      
    }, 

    /*=============================================================
    // SetNavbar
    =============================================================*/
    SetNavbar: function()
    {
        Config.NavbarIsActive = $('#navbar').prop("checked");
        window.localStorage.setItem("Config", JSON.stringify(Config));
        // alert(JSON.stringify(Config)); 
        dice.RefreshNavbar();    
    },                  

    GetImage: function()
    {
        // alert('Take a photo! ');
        navigator.camera.getPicture(function (imageURI) {
            alert('Image: ' + imageURI);
          }, 
          function (message) 
          {
            alert('Failed because: ' + message);
          }, 
          { 
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: $(this).val(),
            saveToPhotoAlbum: true
          });    
    },
        
    /*=============================================================
    // RunDice
    =============================================================*/    
    RunDice: function() 
    {
                          
        $('.dice').each(function()
        {
            if (Config.DiceFace[$('.dice').index($(this))].length > 0) 
            {      
              var CountOfDice = parseInt(Math.random() * (8 - 1 + 1) + 1);
              for (var i=0; i<CountOfDice; i++)
              { 
                  $(this).fadeIn(130, function(){
                      // var index = parseInt(Math.random() * (6 - 1 + 1) + 1);
                      // $(this).css('background-image', "url('img/dice_point/dado_" + index + ".png')");
                      var index = parseInt(Math.random() * (Config.DiceFace[$('.dice').index($(this))].length));
                      //alert($('#' + Config.DiceFace[$('.dice').index($(this))][index]).css('background-image'));  
                      $(this).css('background-image', $('#' + Config.DiceFace[$('.dice').index($(this))][index]).css('background-image'));                   
                      }).delay(130);
              }
            } else
            {
                $(this).css('background-image', '').delay(130);                   
            }
        });

        if ( (window.cordova) && Config.VibrationIsActive ) {
            navigator.notification.vibrate(100);   
        }                                
    },

    /*=============================================================
    // AddDice
    =============================================================*/
    AddDice: function() {
        if ($('.dice').length < 10 ) {        
            dice.AddOneDice();
    
            Config.DiceFace[Config.DiceFace.length] = Config.DiceFace[0];
            window.localStorage.setItem("Config", JSON.stringify(Config));
            Config = JSON.parse(window.localStorage.getItem("Config"));      

            // $('#CountOfDice').slider();
            $('#CountOfDice').val(Config.DiceFace.length).slider('refresh');

            $('.dice').last().css('background-image', $('#' + Config.DiceFace[$('.dice').length-1][0]).css('background-image'));                      
            
            // alert(JSON.stringify(Config)); 
        }   
    },

    /*=============================================================
    // AddOneDice
    =============================================================*/
    AddOneDice: function() {
        if ($('.dice').length < 10 ) {        
            if ( $('.dice').last().parent().parent().attr('class') == 'ui-block-a' ) {
                $('.dice').last().parent().parent().next().append($('.dice').first().clone());    
            } else {
                $('#home_content').append($('.ui-grid-a').last().clone()); 
                $('.dice').last().remove();   
            }
        }
        $('#DiceList').append($('.LiSetDice').last().clone());
        $('.ButtonSetDice').last().attr('id', $('.ButtonSetDice').length - 1);
        $('.ButtonSetDice').last().text('Dice ' + $('.ButtonSetDice').length);
        $('.ButtonSetDice').last().on('tap', this.SetOneDice);  
    },    

    /*=============================================================
    // DelDice
    =============================================================*/
    DelDice: function() {
        if ($('.dice').length > 1 ) 
        {
            dice.DelOneDice();

            Config.DiceFace.splice(Config.DiceFace.length-1, 1);
            window.localStorage.setItem("Config", JSON.stringify(Config));

            $('#CountOfDice').val(Config.DiceFace.length).slider('refresh');           
                      
        }          
    }, 

    /*=============================================================
    // DelOneDice
    =============================================================*/
    DelOneDice: function() {
        if ($('.dice').length > 1 ) {
            if ( $('.dice').last().parent().parent().attr('class') == 'ui-block-a' ) {
                $('.dice').last().parent().parent().parent().remove();    
            } else {
                 $('.dice').last().remove();   
            }   
        }
        $('.ButtonSetDice').last().parent().remove();   
    },     

    /*=============================================================
    // DelAll
    =============================================================*/
    DelAll: function() {
        while ($('.dice').length > 1) 
        {
            // alert($('.dice').length);
            dice.DelDice();   
        }               
    },

    /*=============================================================
    // SetCountOfDice
    =============================================================*/
    SetCountOfDice: function() {
        // alert($('#CountOfDice').val());
        while ($('.dice').length != $('#CountOfDice').val()) {
            if ($('.dice').length < $('#CountOfDice').val())
            {
                dice.AddOneDice();
                Config.DiceFace[Config.DiceFace.length] = Config.DiceFace[0];
            } else if ($('.dice').length > $('#CountOfDice').val())
            {
                dice.DelOneDice();
                Config.DiceFace.splice(Config.DiceFace.length-1, 1);    
            }
        } 

        window.localStorage.setItem("Config", JSON.stringify(Config));
        Config = JSON.parse(window.localStorage.getItem("Config"));                          
    }, 
                  
    /*=============================================================
    // SetOneDice
    =============================================================*/
    SetOneDice: function() {
        ActDice = $(this).attr('id');

        $('#DiceSettingHeader').text('Dice ' + (parseInt(ActDice) + 1) + ' Setting');

        // $('.DiceItem').checkboxradio();  
        $('.DiceItem').checkboxradio().prop('checked', false).checkboxradio('refresh');  
        
        // alert(JSON.stringify(Config));
        for (var i=0; i<Config.DiceFace[ActDice].length; i++)
        {
            // $('.DiceItem[value="' + Config.DiceFace[ActDice][i] + '"]').checkboxradio(); 
            $('.DiceItem[value="' + Config.DiceFace[ActDice][i] + '"]').checkboxradio().prop('checked', true).checkboxradio('refresh');            
        }
        window.location.assign('#DiceSetting'); 
     
    },

    /*=============================================================
    // SelectGroup
    =============================================================*/
    SelectGroup: function() {
        // $(this).val(! $(this).val());
        // $('.' + $(this).attr('id')).checkboxradio();
        $(this).val( ($('.' + $(this).attr('id')).filter(':checked').length < ($('.' + $(this).attr('id')).length - $('.' + $(this).attr('id')).filter(':checked').length) ) );
        $('.' + $(this).attr('id')).checkboxradio().prop('checked', $(this).val()).checkboxradio('refresh');
        dice.ChangeDiceSetting();
    }, 

    /*=============================================================
    // DiceItemChanged
    =============================================================*/
    DiceItemChanged: function() {
        dice.ChangeDiceSetting();
    },

    /*=============================================================
    // ChangeDiceSetting
    =============================================================*/
    ChangeDiceSetting: function() {

        Config.DiceFace[ActDice].splice(0, Config.DiceFace[ActDice].length);
        /*
        if ($('.DiceItem').filter(':checked').length == 0)
        {
            alert('At least one must be selected!'); 
            // $('#d0').checkboxradio(); 
            $('#d0').checkboxradio().prop('checked', true).checkboxradio('refresh');   
        } 
        */
        $('.DiceItem').filter(':checked').each(function() {
            Config.DiceFace[ActDice][Config.DiceFace[ActDice].length] = $(this).val();
        });
        // alert(JSON.stringify(Config));
        window.localStorage.setItem("Config", JSON.stringify(Config));   
    },

    /*=============================================================
    // fixgeometry
    =============================================================*/
    fixgeometry: function() {
      /* Some orientation changes leave the scroll position at something
       * that isn't 0,0. This is annoying for user experience. */
      scroll(0, 0);

      /* Calculate the geometry that our content area should take */
      var header = $(".header:visible");
      var footer = $(".footer:visible");
      var content = $(".content:visible");
      var viewport_height = $(window).height();

      var content_height = viewport_height - header.outerHeight() - footer.outerHeight();

      /* Trim margin/border/padding height */
      content_height -= (content.outerHeight() - content.height());
      content.height(content_height);
    }

};

/*=============================================================
// run UI functions
=============================================================*/
$(document).ready(function(){
    dice.initialize(); 
});

