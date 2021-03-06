window.onload = function()
{
    //------------------ Start Beir Region -----------------------------
    if(!hasCredential())
    {
        alert("Unauthorized Access!");
        location.href = '../../logintest.html';
    }
    //-------------------- End Beir Region -----------------------------

	setTable();
}
/*
####################################################################################
#Function Name: hasCredential
#Input:
#Pre:
#Post: 
#Return: true if the user has valid system credentials, otherwise false
####################################################################################
*/

function hasCredential(){
    if(sessionStorage.getItem('pub_uname') != null && 
       sessionStorage.getItem('pub_pword') != null)
        return true;
    
    return false;
}

/*
################################################################################
#Function Name: setTable
#Input:
#Pre: A database with the required information exist at the appointed adress
#Post: The table is filled with information of all the users in the system
#Return:
################################################################################
*/


function setTable()
{
	var request = "http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=iou_get_all";
	var userList = JSON.parse(httpGet(request))['payload'];
	var container = document.getElementById("userTable");

	for(var i = 0; i < userList.length; i++)
	{
    	var row = container.insertRow(container.rows.length);
   	 	row.insertCell(0).innerHTML = userList[i].first_name + " " + userList[i].last_name;
   	 	row.insertCell(1).innerHTML = userList[i].username;
   	 	var buttons = row.insertCell(2);
   	 	var args = [userList[i].first_name,userList[i].last_name,userList[i].username];
   	 	buttons.innerHTML = '<img onclick="showForm(false,\''+userList[i].first_name+'\',\''+userList[i].last_name+'\',\''+userList[i].username+'\')" src="editButton.png" title="Edit User" style="cursor: pointer"/>';
   	 	buttons.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp";
   	 	buttons.innerHTML += '<img onclick="showCreditForm()" src="creditIcon.png" width="40" height="40" title="Add Credit" style="cursor: pointer" />';
   	 	buttons.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp";
   	 	buttons.innerHTML += '<img onclick="deleteUser(\''+userList[i].username+'\')" src="deleteButton.png" title="Delete User" style="cursor: pointer" />';
	}
}

/*
################################################################################
#Function Name: httpGet
#Input: 
#	-String theUrl: The API command to perform
#Pre: 
#	-A database with the required information exist at the appointed adress
#	-theUrl is a valid API command for the database	
#Post: 
#Return: A JSON object with the reply from the database
################################################################################
*/


function httpGet(theUrl)
{
    //safety net. Not supposed to be here.
    /*if (theUrl.indexOf("iou_get_all") != -1) return getOfflineResponse();*/
    //
    
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false );
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

/*
#####################################################################################
#Function Name: deleteUser
#Input: 
#	-String userName: The username to delete
#Pre: 
#	-A database with the required information exist at the appointed adress
#	-userName exists as user in the database	
#Post: The user userName is fictionally deleted from the database upon confirmation
#Return: 
#####################################################################################
*/


function deleteUser(userName)
{
	if(confirm("Do you really want to delete user " + userName))
		alert("User " + userName + " 'deleted'!");
}

/*
###################################################################################################
#Function Name: showForm
#Input:
#	-Bool is_new_user: Indicates wether the form will be used to add a new user or edit a current
#	-String fname,lname,userName: The first-, Last- and user name of the user
#Pre: 	
#Post: The popup form is shown on the screen with CSS lightbox effect
#Return: 
###################################################################################################
*/

function showForm(is_new_user,fname,lname,userName)
{
	document.getElementById('light').style.display='block';
	document.getElementById('fade').style.display='block';
	fillForm(is_new_user,fname,lname,userName);
}

/*
################################################################################
#Function Name: hideForm
#Input:
#Pre: 	
#Post: The popup form is hidden and restored to it's default values
#Return: 
################################################################################
*/

function hideForm()
{
	document.getElementById('light').style.display='none';
	document.getElementById('fade').style.display='none';
	document.getElementById("errorMessage").style.visibility = "hidden";
	document.getElementById("confirmButton").value = "Save Changes";
	document.getElementById("errorMessage").style.color = "red";
	
}

/*
################################################################################################
#Function Name: fillForm
#Input:
#	-Bool is_new_user: Indicates wether the form is used to create a new user or edit a current
#	-String fname,lname,userName: The first-, Last- and user name of the user
#Pre:
#Post: The popup form is pre filled with the current user information
#Return: 
################################################################################################
*/

function fillForm(is_new_user,fname,lname,userName)
{
	document.getElementById("userName").value = userName;
	document.getElementById("password").value = userName;
	document.getElementById("confirmPassword").value = userName;
	document.getElementById("firstName").value = fname;
	document.getElementById("lastName").value = lname;
	if (!is_new_user)
	{
		document.getElementById("email").value = "trololol@hohohoho.nana";
		document.getElementById("phone").value = "0123456789";
	}
	else
	{
		document.getElementById("confirmButton").value = "Create User";
		document.getElementById("email").value = "";
		document.getElementById("phone").value = "";
	}
}

/*
##################################################################################
#Function Name: checkEqualPasswords
#Input:
#Pre:
#Post: 
#Return: true if the values in both the passwordfields are equal, otherwise false 
##################################################################################
*/

function checkEqualPasswords()
{
	if (document.getElementById("password").value == document.getElementById("confirmPassword").value)
		return true;
	else
		return false;	
}

/*
##################################################################################
#Function Name: updateUserInfo
#Input:
#Pre:
#Post: Checks each field for invalid characters. If invalid characters are found
	   displays relevant error message. Otherwise fictionally updates the current
	   user information with the values from all the fields
#Return: 
##################################################################################
*/

function updateUserInfo()
{
	var parameters = {};
	parameters['userName'] = document.getElementById("userName").value;
	parameters['password'] = document.getElementById("password").value;
	parameters['firstName'] = document.getElementById("firstName").value;
	parameters['lastName'] = document.getElementById("lastName").value;	
	parameters['phone'] = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	var pass = 1;
	var field_of_error;
	var error = document.getElementById("errorMessage");
	for(var key in parameters)
	{
		if (checkSymbols(parameters[key], /^[0-9a-zA-Z]+$/))
			continue;
		else
		{
			pass = 0;
			field_of_error = key;
			break;
		}		
	}
	if (checkSymbols(email, /^\w+@ [a-zA-Z_]+?\.[a-zA-Z]{2,3}$/))
	{
		pass = 0;
		field_of_error = "email";
	}
	var equalPasswords = checkEqualPasswords();
	if (pass === 1 && equalPasswords)
	{
		//This part can update the database physicly, but we are not supposed to do it. It will be done fictionally instead
		//The username and password should be retrieved from the session storage instead, but the way of building the string is the same.

		/*
		var request = "http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=user_edit" + "&new_username="+parameters.userName+"&new_password=" +parameters.password +"&first_name="+parameters.firstName
		+"&last_name="+parameters.lastName+"&email="+parameters.email+"&phone="+parameters.phone;
		httpGet(request);
		*/
 
			if (document.getElementById("confirmButton").value == "Create User")
			{
				error.innerHTML = "New User created!";
			}
			else
			{	
				error.innerHTML = "Account information updated";
			}
			error.style.color = "lime";
			error.style.visibility = "visible";
			setTimeout(hideForm, 2000);
			
	}
	else
	{		
		if (!equalPasswords)
			error.innerHTML = "Passwords are not equal!";
		else
			error.innerHTML = "You have invalid character(s) in the " + field_of_error + " field! Please correct";
		error.style.visibility = "visible";
	}

}

/*
##################################################################################
#Function Name: checkSymbols
#Input:
#	-String fieldString: The string to check for invalid characters
#	-Regular Expression regex: The regular expression to match against
#Pre: regex is a valid regular expression
#Post: 
#Return: true if fieldString only contains characters from regex, otherwise false 
##################################################################################
*/

function checkSymbols(fieldString,regex)
{
	
	if (regex.test(fieldString)) 
		return true;
	else 
		return false;
}

/*
##################################################################################
#Function Name: showCreditForm
#Input:
#Pre: 
#Post: The Add Credit popup form is shown
#Return: 
##################################################################################
*/

function showCreditForm()
{
	document.getElementById('credit').style.display='block';
	document.getElementById('fade').style.display='block';
}

/*
##################################################################################
#Function Name: updateCredit
#Input:
#Pre: 
#Post: Checks if the entered value is a positive number. If valid, updates the 
	   users credit, otherwise displays error message
#Return: 
##################################################################################
*/

function updateCredit()
{
	var error = document.getElementById("creditError");
	var credits = document.getElementById("creditField").value;
	if (checkSymbols(credits, /^[0-9]+$/))
	{
		document.getElementById("creditError").style.visibility = "hidden";
		counterDiv.style.visibility = "visible";
		var creditsInt = parseInt(credits);
		document.getElementById("creditField").value = creditsInt;
		//As the iou_get does not work for regular users, it will be fictional for the time being, always starting from 0
		animatedCounter(0,creditsInt,Math.floor(creditsInt/15));		
	}
	else
	{
		error.style.color = "red";
		error.innerHTML = "You can only enter positive numbers";
		error.style.visibility = "visible";
	}
}

/*
##################################################################################
#Function Name: hideCreditEdit
#Input:
#Pre: 
#Post: Hides the Add Credit form and restores it's default value
#Return: 
##################################################################################
*/

function hideCreditEdit()
{
	document.getElementById("credit").style.display='none';
	document.getElementById("fade").style.display='none';
	document.getElementById("creditError").style.visibility = "hidden";
	document.getElementById("creditField").value = "";
	document.getElementById("counterDiv").style.visibility = "hidden";
}

/*
##################################################################################
#Function Name: animatedCounter
#Input:
#	-Int currentAmount: The current credit for the user
#	-Int final: The credit the user is supposed to have
#	-Int increment: How much the credit should be incremented with
#Pre: 
#	-increment > 0
#Post: The users credit amount is increased and displayed through an 
	  "animated" counter. More of an illusion rather than animation
#Return: 
##################################################################################
*/

function animatedCounter(currentAmount, final,increment) {
    var current = currentAmount;
    var obj = document.getElementById("counter");
    current += increment;
        if (current >= final) {
             obj.innerHTML = final;
             setTimeout(hideCreditEdit,2000);         
        }
        else{        	
        	obj.innerHTML = current;  
            setTimeout(function() {
                animatedCounter(current,final,increment)
            }           , 20);
        }
            
}


/*
###############################################################################
#Backup functions to use if the database would go haywire for the presentation
###############################################################################
*/


function getOfflineResponse() {
    return multiline(function() {/*!
{"type" : "iou_get_all", "payload" : [{"username" : "anddar","first_name" : "Andrea","last_name" : "Darzi","assets" : "-357460"},{"username" : "aamsta","first_name" : "Aamu","last_name" : "Stankic","assets" : "-5120"},{"username" : "maihon","first_name" : "Maiken","last_name" : "Honda","assets" : "-3415"},{"username" : "jovsit","first_name" : "Zlatan","last_name" : "Ibrahimovic","assets" : "-1637"},{"username" : "liatra","first_name" : "Liam","last_name" : "Traverso","assets" : "-1055"},{"username" : "pauaaf","first_name" : "Paula","last_name" : "Aafjes","assets" : "-720"},{"username" : "dansch","first_name" : "Danna","last_name" : "Schermer","assets" : "-685"},{"username" : "undefined","first_name" : "Hej","last_name" : "Då","assets" : "-440"},{"username" : "eulcou","first_name" : "Eul�lia","last_name" : "Coughlan","assets" : "-270"},{"username" : "livzha","first_name" : "Livianus","last_name" : "Zhao","assets" : "-260"},{"username" : "lasnic","first_name" : "Lasse","last_name" : "Nicholson","assets" : "-250"},{"username" : "kenolg","first_name" : "Kenan","last_name" : "Olguin","assets" : "-187"},{"username" : "elepic","first_name" : "Elektra","last_name" : "Pickle","assets" : "-185"},{"username" : "gollan","first_name" : "Golnar","last_name" : "Langley","assets" : "-150"},{"username" : "felbar","first_name" : "Felix","last_name" : "Barto�","assets" : "-125"},{"username" : "einyam","first_name" : "Einarr","last_name" : "Yamauchi","assets" : "-115"},{"username" : "hyrlap","first_name" : "Hyram","last_name" : "Lapointe","assets" : "-105"},{"username" : "tohei","first_name" : "T�fa","last_name" : "Heinrich","assets" : "-85"},{"username" : "sulpen","first_name" : "Sulis?aw","last_name" : "Pender","assets" : "-60"},{"username" : "hirchr","first_name" : "Hiram","last_name" : "Christopherson","assets" : "-55"},{"username" : "giamik","first_name" : "Giacinta","last_name" : "Mikkelsen","assets" : "-50"},{"username" : "sulstr","first_name" : "Sulayman","last_name" : "Street","assets" : "-40"},{"username" : "karbly","first_name" : "Karme","last_name" : "Blythe","assets" : "-40"},{"username" : "valpag","first_name" : "Valeria","last_name" : "Pagani","assets" : "-35"},{"username" : "bratam","first_name" : "Branko","last_name" : "Tam�s","assets" : "-30"},{"username" : "shapet","first_name" : "Sharma","last_name" : "Pet?fi","assets" : "-30"},{"username" : "marsti","first_name" : "Marin","last_name" : "Stieber","assets" : "-30"},{"username" : "symzim","first_name" : "Symeonu","last_name" : "Zimmermann","assets" : "-25"},{"username" : "edraug","first_name" : "Edric","last_name" : "Augustin","assets" : "-25"},{"username" : "nikpro","first_name" : "Nika","last_name" : "Proulx","assets" : "-20"},{"username" : "fercrn","first_name" : "Ferdin�nd","last_name" : "Crncevic","assets" : "-15"},{"username" : "steber","first_name" : "Stefan","last_name" : "Bernard","assets" : "-15"},{"username" : "didwat","first_name" : "Dido","last_name" : "Waters","assets" : "-5"},{"username" : "olubra","first_name" : "Oluwakanyinsola","last_name" : "Braun","assets" : "-5"},{"username" : "jeaats","first_name" : "Jeanne","last_name" : "Atses","assets" : "0"},{"username" : "pomgra","first_name" : "Pompeius","last_name" : "Graner","assets" : "0"},{"username" : "krysan","first_name" : "Krystyna","last_name" : "Santiago","assets" : "0"},{"username" : "yevowe","first_name" : "Yevpraksiya","last_name" : "Owens","assets" : "0"},{"username" : "benfau","first_name" : "Bento","last_name" : "Faucher","assets" : "0"},{"username" : "orapan","first_name" : "Orabela","last_name" : "Panders","assets" : "0"},{"username" : "ankov","first_name" : "Anders","last_name" : "Kovalchyck","assets" : "0"},{"username" : "teojen","first_name" : "Teodora","last_name" : "Jensen","assets" : "0"},{"username" : "oludra","first_name" : "Oluwatoyin","last_name" : "Drake","assets" : "0"},{"username" : "ceznew","first_name" : "Cezar","last_name" : "Newman","assets" : "0"},{"username" : "jershi","first_name" : "Jerry","last_name" : "Shizuka","assets" : "0"},{"username" : "molbab","first_name" : "Molle","last_name" : "Babi?","assets" : "5"},{"username" : "larsch","first_name" : "Lara","last_name" : "Schenck","assets" : "5"},{"username" : "schjou","first_name" : "Schwanhild","last_name" : "Joubert","assets" : "10"},{"username" : "felfra","first_name" : "Felicia","last_name" : "Franklin","assets" : "10"},{"username" : "ervtod","first_name" : "Ervin","last_name" : "Todd","assets" : "13"},{"username" : "janhei","first_name" : "Jancsi","last_name" : "Heiman","assets" : "15"},{"username" : "foobar","first_name" : "Foo","last_name" : "Bar","assets" : "15"},{"username" : "domolh","first_name" : "Domen","last_name" : "Olhouser","assets" : "15"},{"username" : "marpug","first_name" : "Mariana","last_name" : "Pugliese","assets" : "20"},{"username" : "kaywan","first_name" : "Kaye","last_name" : "Wang","assets" : "25"},{"username" : "jacabb","first_name" : "Jacob","last_name" : "Abbatelli","assets" : "25"},{"username" : "rewes","first_name" : "R�gulo","last_name" : "Westerberg","assets" : "25"},{"username" : "muhtof","first_name" : "Muhammed","last_name" : "Toft","assets" : "25"},{"username" : "eusgor","first_name" : "Eustachius","last_name" : "Gorski","assets" : "45"},{"username" : "katfab","first_name" : "Katrien","last_name" : "Fabre","assets" : "50"},{"username" : "olislu","first_name" : "Oliver","last_name" : "Slusarski","assets" : "65"},{"username" : "saskru","first_name" : "Sa�a","last_name" : "Kr�ger","assets" : "110"},{"username" : "zulgor","first_name" : "Zuleika","last_name" : "Gorecki","assets" : "120"},{"username" : "aubbla","first_name" : "Aubrey","last_name" : "Blackwood","assets" : "150"},{"username" : "","first_name" : "","last_name" : "","assets" : "156"},{"username" : "prabar","first_name" : "Prabhakar","last_name" : "Bartos","assets" : "170"},{"username" : "sivan","first_name" : "S?d?ka","last_name" : "Van","assets" : "235"},{"username" : "pierre","first_name" : "Pierre","last_name" : "Flener","assets" : "1000"},{"username" : "","first_name" : "","last_name" : "","assets" : "1245"},{"username" : "aqulyn","first_name" : "Aquilina","last_name" : "Lyndon","assets" : "1248"},{"username" : "","first_name" : "","last_name" : "","assets" : "3000"},{"username" : "svetor","first_name" : "Svetlana","last_name" : "Torres","assets" : "8036"},{"username" : "jorass","first_name" : "Jory","last_name" : "Assies","assets" : "10869"}]}
    
    */});
}
function multiline(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
