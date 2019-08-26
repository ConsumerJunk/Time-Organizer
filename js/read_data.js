//onload="this.onload=function(){};handleClientLoad()"

var pass;
var step = 1;
var canPrecede;

var spreadsheet_hash = "b7GpVqgVPcoiY7UShj0ffZRdHWBcQ9RmY1yOAYj1rrbpA8dbpf/TKU8pVcyB6wsjxr+ReQjjR5fpa1gKnmADGhJx4sfBJWkql00I3D3EVCbwg71j5inGrGkhc1SX1LSndNAUM8YxRQY45/J/JFfK0LtNKeH50dNW836Eim7mWw4=?2w3mKi2RqtSZepY5GgbR5uJaj82Ko0ofpTkoB/hUkggcExmgPXumAXrw4mNAdYxG5bIlLyvPRUTFh5+8Zkcb8w==";
var apiKey_hash = "2QbWntuKACDhN60JeNLSoHgJpqdAjPSnZ/y6MmScoYUiOxesLHqxtakUKBxr/ystCIttUfS30ByCsAZ7+NkKMpb93L2hr5ii1JuUnHbk4p3MexSrd66lKLboFevvNIE0E9eIOX4CuPv90PSEzGFsg4AemNPtU4vNa9jgrL+QRiY=?r8AYLx4KaL5eIINZ/eaQStJy8r+dadSb6H+DblaY6lzAnuSKAeFyKXONqcX5qKquh/z26ywaKushQK+x+HBZrQ==";
var client_hash = "14nBfi7hG5FRusJkcg5+kIC3vXIC0S9qFJ7Hp4eC6zpOcGQwOBnYJ5rZ6pNByibKHvQNHpr2kOSI+Xocktl72loZZ6kso72lolii5CdVm5dr3HoC5jXE1lcVWrL5e+5OGzNPU94aI9d7jx1WiKxX2h1I+IMqUf2Ck46g6KiYYSI=?uQfz+QgC498GrVhleU/fvAUsk1almGPMOHI+4mzsDaglaGFTXjt/Tc/BZL3XW1j6wUWpIdbpPm+ihr4loVc1yWxQXG7B/Oo+7ktHZlwfzIAzeyOjxQFxSU/hv7FrXd97";

var debug_pass = "";

$(document).ready(function() {
	if(debug_pass != "") {
		$("#pass")[0].value = debug_pass;
		login();
		setTimeout(handleSignInClick, 1200);
	}
	$("#pass")[0].addEventListener("keyup", function(e) {
		if (event.keyCode === 13) {
			e.preventDefault();
			login();
		}
	});
});

function makeApiCall() {

	var params = {
		spreadsheetId: decrypt(pass, spreadsheet_hash),  // TODO: Update placeholder value.
		range: 'Daily'
	};

	var request = gapi.client.sheets.spreadsheets.values.get(params);
	request.then(function(response) {
		setStep(3);
		display(response.result);
	}, function(reason) {
		console.error('error: ' + reason.result.error.message);
	});
}

function initClient() {
	var API_KEY = decrypt(pass, apiKey_hash);

	var CLIENT_ID = decrypt(pass, client_hash);

	var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

	gapi.client.init({
		'apiKey': API_KEY,
		'clientId': CLIENT_ID,
		'scope': SCOPE,
		'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
	}).then(function() {
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
		updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
}

function handleSignInClick() {
	gapi.auth2.getAuthInstance().signIn();
	setTimeout(makeApiCall(), 3000);
	window.onbeforeunload = gapi.auth2.getAuthInstance().signOut();
}

function handleSignOutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

function login() {
	pass = $("#pass")[0].value;
	var cipherCheck = "fZ/NZeSC6wcPabH23+HsVdz8nk/EAWvXt4xAanCwgc/1ybr1t64NYkVTr+nQOdxTtpBWitUZyk3dkClUOhUT2lTiyQaf6PVFQQNWvVCk7MhrawzNmY8yGJEnsJunLlH6WRYprwrLI3Ebus8rFbsHaa8Jq0N7fQrY8zTqJ2xsnlY=?w0eAb84AaYoa+GOM+laiTTrHC4DkXwgKVIxcHtemdx0=";
	if(decrypt(pass, cipherCheck) == "check") {
		handleClientLoad();
		setStep(step + 1);
	} else {
		alert("Incorrect password");
	}
}

function setStep(stepAmount) {
	step = stepAmount;
	$("[step]").removeClass();
	$("[step]").addClass("step_hidden");
	$("[step=" + step + "]").removeClass();
	$("[step=" + step + "]").addClass("step_shown");
}

function encrypt(pass, content) {
	var rsaKey = cryptico.generateRSAKey(pass, 1024);
	var pubKey = cryptico.publicKeyString(rsaKey);
	return cryptico.encrypt(content, pubKey).cipher;
}

function decrypt(pass, cipher) {
	var rsaKey = cryptico.generateRSAKey(pass, 1024);
	return cryptico.decrypt(cipher, rsaKey).plaintext;
}