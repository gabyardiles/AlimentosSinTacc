/*El script debe ser ejecutado en localhost/celiapp*/
$(function() {

  /*Variables

  app_id es la id de la aplicacion
  scopes - salidas que pide para autentificacion
  btn_loguin - variable de carga de un boton creado con bootstrap con id loguin
  div_session cuando se inicia secion se crea un div con los elementos img un strong y el boton cerrar pertenecientes a cerrar sesion y datos del usuario*/
	var app_id = '523561487853384';
	var scopes = '';

	var btn_login = '<a href="#" id="login" class="btn btn-primary">Iniciar sesión</a>';

	var div_session = "<div id='facebook-session'>"+
					  "<strong></strong>"+
					  "<img>"+
					  "<a href='#' id='logout' class='btn btn-danger'>Cerrar sesión</a>"+
					  "</div>";


/*Checkeo de informacion de api - inicio de la misma*/
	window.fbAsyncInit = function() {

	  	FB.init({
	    	appId      : app_id,
	    	status     : true,
	    	cookie     : true, 
	    	xfbml      : true, 
	    	version    : 'v2.1'
	  	});

/*Checkeo de informacion de logueo*/
	  	FB.getLoginStatus(function(response) {
	    	statusChangeCallback(response, function() {});
	  	});
  	};
/*Checkeo de informacion de logueo accion en base a la respiesta 
si esta conectado llama a getFacebookData sino hace un callback*/
  	var statusChangeCallback = function(response, callback) {
  		console.log(response);
   		
    	if (response.status === 'connected') {
      		getFacebookData();
    	} else {
     		callback(false);
    	}
  	}

/*El  Realisa un callback*/

  	var checkLoginState = function(callback) {
    	FB.getLoginStatus(function(response) {
      		callback(response);
    	});
  	}
/*Remueve el boron iniciar sesion y crea el div de la variable cerrar sesion - ademas toma la foto del usuario y la pone en el img con los demas datos*/
  	var getFacebookData =  function() {
  		FB.api('/me', function(response) {
	  		$('#login').after(div_session);
	  		$('#login').remove();
	  		$('#facebook-session strong').text("Bienvenido: "+response.name);
	  		$('#facebook-session img').attr('src','http://graph.facebook.com/'+response.id+'/picture?type=large');
	  	});
  	}

/*Son las funciones de peticion de que se va a hacer con la respuesta de la api sobre si esta conectada o no.
los scopes estan en blanco porque los permisos definidos no tiene los mismo nombre para todos los paises y en blanco toma los basicos por defecto*/
  	var facebookLogin = function() {
  		checkLoginState(function(data) {
  			if (data.status !== 'connected') {
  				FB.login(function(response) {
  					if (response.status === 'connected')
  						getFacebookData();
  				}, {scope: scopes});
  			}
  		})
  	}
/*Accion de desloguiar una ves loguiado, remueve el div y deja el boton iniciar session*/
  	var facebookLogout = function() {
  		checkLoginState(function(data) {
  			if (data.status === 'connected') {
				FB.logout(function(response) {
					$('#facebook-session').before(btn_login);
					$('#facebook-session').remove();
				})
			}
  		})

  	}

/*Cuando se hace click en el control asignado a loguin llama a facebookLoguin()*/

  	$(document).on('click', '#login', function(e) {
  		e.preventDefault();

  		facebookLogin();
  	})
/*Cuando se hace click en el control asignado a desloguiar llama a facebookLogout()*/
  	$(document).on('click', '#logout', function(e) {
  		e.preventDefault();
      /*Popup de confirmacion de deslogueo*/
  		if (confirm("¿Está seguro?"))
  			facebookLogout();
  		else 
  			return false;
  	})

})
