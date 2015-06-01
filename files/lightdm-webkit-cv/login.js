var login = (function (lightdm, $) {
    var username = null;
    var password = null;
    password_interval_id = 0;
    var $user = $('#user');
    var $pass = $('#pass');
    var $sess = $('#session');
    
    var setup_session_list = function () {
        var $list = $sess;
        var to_append = null;
        $.each(lightdm.sessions, function (i) {
            var key  = lightdm.sessions[i].key;
            var name = lightdm.sessions[i].name;

	    if(key == lightdm.default_session){
		$list.append(
                    '<option selected="' +
			key +
			'">' +
			name +
			'</option>'
		);
	    } else {
		$list.append(
		    '<option value="' +
			key +
			'">' +
			name +
			'</option>'
		);
	    }
        });

	
    };


    var auth = function() {
	lightdm.cancel_timed_login();

	
	window.start_authentication();


	
	
    }
    
    // Functions that lightdm needs
    window.start_authentication = function () {
	username = $user.val() || null;
	
	
        lightdm.start_authentication(username);
    };
    
    window.provide_secret = function () {
	
        password = $pass.val() || null;
	show_prompt(password);
	if(password !== null) {
	    lightdm.provide_secret(password);    
	}
    };

    window.timed_login = function(user) {}
    
    window.authentication_complete = function () {
	
        if (lightdm.is_authenticated) {
	    show_prompt('Logged in');
	    
	    session_list = document.getElementById('session');
	    session = lightdm.sessions[session_list.selectedIndex];
	    lightdm.login(lightdm.authentication_user, session.key);
        } else {
	    lightdm.cancel_authentication();
	}

    };
    // These can be used for user feedback
    window.show_error = function (e) {
        console.log('Error: ' + e);

    };
    window.show_prompt = function (e) {
	if(password_interval_id > 0) clearInterval(password_interval_id);
	password_interval_id = setInterval(function() {
	    window.provide_secret();} , 250);
    };

    // exposed outside of the closure
    var init = function () {
        $(function () {
            setup_session_list();


            $('form').on('submit', function (e) {
                e.preventDefault();
                auth();
            });
        });
    };

    return {
        init: init
    };
} (lightdm, jQuery));

login.init();
