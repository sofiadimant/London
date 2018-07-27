var express = require('express');
var router = express.Router();;
var bodyParser = require('body-parser');
var app = express();
var DButilsAzure = require('../DButils');
var Regex = require("regex");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var  superSecret = "SUMsumOpen";



router.get('/PopularPOI',function (req,res) 
{
var tresh=60;
DButilsAzure.execQuery("select POI_Name, POI_Picture from POI where Rank_Per >= "+tresh+"")    
    .then(function(ans) {
        res.json({
            poi:ans
            });                          
        }
    )
    .catch(ans=>res.send("" +ans));
});


router.post('/Register', function (req, res) {
    var userToCheck=req.body;
    var valid=true;
    if(!userToCheck){
        valid=false
        res.send("Register Failure");
        res.end();
        return 
    }
    var userName=userToCheck.userName; 
    var password=userToCheck.password; 
    DButilsAzure.execQuery("select * from Users where userName= '"+userName+"'")
    .then(function(ans){   
        if(ans.length != 0){ 
            valid=false       
            res.send("Please Choose Another User Name");
            res.end(); 
            return          
        }
        
    var firstName=userToCheck.firstName;
    var lastName=userToCheck.lastName;
    var city=userToCheck.city;
    var country=userToCheck.country;
    var email=userToCheck.email;
    var questionAns=userToCheck.questionAns;
    var questionID=userToCheck.questionID;
    var isAdmin = userToCheck.isAdmin;
 

    let sql="insert into Users values(\'"+userName + "\', \'" +password + "\', \'" + firstName +
    "\', \'" + lastName + "\',\'" + city + "\',\'" + country + "\', \'" + email + "\', \'" + questionAns + "\', \'" + questionID +
    "\', " + isAdmin + ");";
    DButilsAzure.execQuery(sql).then(function(ans) {
        
        if (!(userToCheck.favCatego1=="undefined")){
            var favCatego1 = userToCheck.favCatego1;
            let sqlCategory1 = "insert into User_Fav_Categories values (\'"+userName + "\', \'" +favCatego1 + "\')"
            DButilsAzure.execQuery(sqlCategory1)
            .then(ans=> res.send("then"))
            .catch(ans=>res.send("catch"));
        }
    
        if (!(userToCheck.favCatego2=="undefined")){
            var favCatego2 = userToCheck.favCatego2;
            let sqlCategory2 = "insert into User_Fav_Categories values (\'"+userName + "\', \'" +favCatego2 + "\')"
            DButilsAzure.execQuery(sqlCategory2)
            .then(ans=> res.send("then"))
            .catch(ans=>res.send("catch"));
        }

        if (!(userToCheck.favCatego3=="undefined")){
            var favCatego3 = userToCheck.favCatego3;
            let sqlCategory3 = "insert into User_Fav_Categories values (\'"+userName + "\', \'" +favCatego3 + "\')"
            DButilsAzure.execQuery(sqlCategory3)
            .then(ans=> res.send("then"))
            .catch(ans=>res.send("catch"));
        }

        sendToken(userName,password, res)
    })   
    .catch(ans=>res.send("error" +ans));
    });
});

 router.post('/LogIn',function (req,res) {
    var userToCheck=req.body;
    
	if(!userToCheck){
		res.send("login failure");
		res.end();
	}
	var userName=userToCheck.userName;
	var password=userToCheck.password;
	DButilsAzure.execQuery("select user_password from Users where userName = '"+userName+"'")    
		.then(function(ans) {
			if (ans.length == 0)
				return Promise.reject('Wrong Username');
			else if (!(ans[0].user_password === userToCheck.password)) {
				return Promise.reject('Wrong Password');}                     			
			sendToken(userName,password,res)			        
			}
		)
	.catch(ans=>res.send("FALSE"));
    });
    
    router.post('/RestorePassword',function (req,res) {
		var userToCheck=req.body;
		if(!userToCheck){
			res.send("Restore Password Failure");
            res.end();
            return
		}
		var userName=userToCheck.userName;
        var ans=userToCheck.questionAns;
	   DButilsAzure.execQuery("select * from Users where userName = '"+userName+"'")    
			.then(function(ans) {		   
				if (ans.length == 0)
					return Promise.reject('Wrong Username');
				else if (ans[0].qustionAns !== userToCheck.questionAns) {
                    return Promise.reject('Wrong Answer');
                }					
				else{
                    password=ans[0].user_password,
                    res.send(password)
				}
			})
			.catch(ans=>res.send("" +ans));
        });
        
/*********** */
router.get('/POIName/:POI_Name',function (req,res) {
    var POI_Name=req.params.POI_Name;
    let sql ="select * from POI where POI_Name ='"+POI_Name+"'";
    DButilsAzure.execQuery(sql)    
    .then(function(ans) {
        if (ans.length == 0)
            return Promise.reject('Wrong POI Name');
        else{  
            res.json({
                poi: ans
            });	
        }
    })
    .then(ans=> res.send("then"))
    .catch(ans=>res.send("catch"));
    });

    /*********** */

router.post('/authenticate', function (req, res) {

    if (!req.body.userName || !req.body.password)
        res.send({ message: "bad values" })

    else {

        for (id in Users) {
            var user = Users[id]

            if (req.body.userName == user.userName)
                if (req.body.password == user.password)
                    sendToken(user, res)
                else {
                    res.send({ success: false, message: 'Authentication failed. Wrong Password' })
                    return
                }
        }

        res.send({ success: false, message: 'Authentication failed. No such user name' })
    }

})


function sendToken(user,password, res) {
        var payload = {
            userName: user
        }
    
        var token = jwt.sign(payload, 'superSecret', {
            expiresIn: "1d"  // expires in 24 hours
        });
    
        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    }
 
    

    router.get('/QuestionIdByUserName/:userName',function (req,res) {
        var userName=req.params.userName;
        let sql ="select question from RegistrationQuestions where QuestionID  = (select question_ID from Users where userName ='"+userName+"')";
        DButilsAzure.execQuery(sql)    
        .then(function(ans) {
            if (ans.length == 0)
                return Promise.reject('Wrong userName Name');
            else{  
                res.send(ans)
            }
        })
        .catch(ans=>res.send("catch"));
        });

        router.get('/AllCategories',function (req,res) {
        let sql ="select * from Category";
        DButilsAzure.execQuery(sql)    
        .then(function(ans) {
            if (ans.length == 0)
                return Promise.reject('No Categories');
            else{  
                res.send(ans)
            }
        })
        .catch(ans=>res.send("catch"));
        });

           ///sofia-changed
	 router.get('/GetAllPOI',function (req,res) 
	 {
		 let sql ="select * from POI"
		 DButilsAzure.execQuery(sql)   
		 .then(function(ans) {		  
				 res.json({
					 poi: ans
				 });	
			 }
		)
		
	 });
module.exports = router;