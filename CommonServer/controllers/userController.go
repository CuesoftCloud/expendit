package controller

import (
	"context"
	"expendit-server/database"
	helper "expendit-server/helpers"
	"expendit-server/models"
	"expendit-server/utils"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
  
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)


var  userCollection *mongo.Collection = database.OpenCollection(database.Client, "user")
var validate = validator.New()
func HashPassword(password string) string{
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil{
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userHashedPassword string, providedPassword string) (bool, string) {
    err := bcrypt.CompareHashAndPassword([]byte(userHashedPassword), []byte(providedPassword))
    if err != nil {
        return false, "email or password is not correct"
    }
    return true, ""
}

func Signup()gin.HandlerFunc{
	
	return func(c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var user models.User

		if err := c.BindJSON(&user); err != nil {
			log.Println("Error binding JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
			return
		}
		

		validationErr := validate.Struct(user)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":validationErr.Error()})
			return 
		}
		count, err := userCollection.CountDocuments(ctx, bson.M{"email":user.Email})
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error":"error occurred while checking for the user"})
			defer cancel()
			return
		}

		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error":"email already exist, try using another email"})
			defer cancel()
			return 
		}

		password := HashPassword(*user.Password)
		user.Password = &password

		count, err = userCollection.CountDocuments(ctx , bson.M{"phone":user.Phone})
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error":"error occurred while checking for phone  number"})
		    defer cancel()
			return
		}
		if count > 0{
			c.JSON(http.StatusInternalServerError, gin.H{"message":"unsuccessful", "error":"this email or phone number "})
		    defer cancel()
			return
		
		}
		user.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.ID = primitive.NewObjectID()
		user.User_id = user.ID.Hex()
	    token, refreshToken, _:= helper.GenerateAllTokens(*user.Email, *user.First_name , *user.Last_name, *user.User_type, *&user.User_id)
        user.Token = &token
		user.Refresh_token = &refreshToken

	   resultInsertionNumber, insertErr :=	userCollection.InsertOne(ctx, user)
	   if insertErr != nil{
		msg := fmt.Sprintf("User item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error":msg})
		defer cancel()
		return 
	   }
	   defer cancel()
	   c.JSON(http.StatusOK,gin.H{"message":"successful", "inserted_id":resultInsertionNumber})
	}
}



func Login() gin.HandlerFunc {
    return func(c *gin.Context) {
        var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
        defer cancel()

        var user models.User
        var foundUser models.User

        if err := c.BindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        log.Printf("User details: %+v\n", user)

        err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "email or password is incorrect"})
            return
        }

        // Check if the user is found based on the email
        if *foundUser.Email == "" {
            c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
            return
        }

        // Log foundUser details for debugging
        log.Printf("Provided Password: %s", *user.Password)
        log.Printf("Stored Password: %s", *foundUser.Password)
        log.Printf("Found User details: %+v\n", foundUser)

        

		err = bcrypt.CompareHashAndPassword([]byte(*foundUser.Password), []byte(*user.Password))
         if err != nil {
         log.Printf("Password verification failed: %v", err)
         c.JSON(http.StatusUnauthorized, gin.H{"error": "email or password is incorrect"})
          return
        }

        token, refreshToken, _ := helper.GenerateAllTokens(*foundUser.Email, *foundUser.First_name, *foundUser.Last_name, *foundUser.User_type, foundUser.User_id)
        helper.UpdateAllTokens(token, refreshToken, foundUser.User_id)

        c.JSON(http.StatusOK, foundUser)
    }
}

func  GetUsers()  gin.HandlerFunc{
	return func (c *gin.Context){
	if err := helper.CheckUserType(c, "ADMIN"); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		recordPerPage, err := strconv.Atoi(c.Query("recodePerPage"))
		if err != nil || recordPerPage < 1 {
			recordPerPage = 10 
		}
		page, err1 := strconv.Atoi(c.Query("page"))
		if err1 != nil || page<1{
			page = 1
		}

		startIndex := (page - 1 ) * recordPerPage
		startIndex, err = strconv.Atoi(c.Query("startIndex"))
		
		matchStage := bson.D{{Key:"$match", Value: bson.D{{}}}}
		groupStage := bson.D{{Key:"$group", Value: bson.D{
			        {Key: "_id", Value: bson.D{{Key: "_id",Value: "null"}}},
			 {Key:"total_count", Value: bson.D{{Key:"$sum",Value: 1}}},
			 {Key: "data", Value: bson.D{{Key:"$push", Value:"$$ROOT"}}}}}}
	        projectStage := bson.D{
				{Key:"$project",Value: bson.D{
					{Key:"_id",Value: 0},
					{Key:"total_count",Value:1},
					{Key: "user_items", Value: bson.D{{Key:"$slice", Value: []interface{}{"$data",startIndex, recordPerPage}}}},}}}
		       result, err := userCollection.Aggregate(ctx, mongo.Pipeline{
				   matchStage, groupStage, projectStage})
				defer cancel()
				if err!=nil{
					c.JSON(http.StatusInternalServerError, gin.H{"error":"error occurred while user items"})
				}
				var allusers []bson.M
				if err = result.All(ctx, &allusers); err!=nil{
					log.Fatal(err)
}
c.JSON(http.StatusOK, allusers[0])}}
		


func GetUser()  gin.HandlerFunc{
	return func(c *gin.Context){
		userId := c.Param("user_id")

		if err := helper.MatchUserTypeToUid(c, userId); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		
		var user models.User
		err := userCollection.FindOne(ctx, bson.M{"user_id":userId}).Decode(&user)
        defer cancel()
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return 
		}
		c.JSON(http.StatusOK, user)

		
	}
}


func ChangePassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		// Get user ID from context
		userId, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "user_id not found in context"})
			return
		}

		var changePasswordRequest models.ChangePasswordRequest

		if err := c.BindJSON(&changePasswordRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Validate the request data
		validationErr := validate.Struct(changePasswordRequest)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		// Get the user from the database
		var user models.User
		err := userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching user data"})
			return
		}

		// Verify the old password
		passwordIsValid, msg := VerifyPassword(*changePasswordRequest.OldPassword, *user.Password)
		if !passwordIsValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// Hash the new password
		newHashedPassword := HashPassword(*changePasswordRequest.NewPassword)

		// Update the user's password in the database
		update := bson.M{"$set": bson.M{"password": newHashedPassword}}
		filter := bson.M{"user_id": userId}

		_, err = userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while updating password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
	}
}


func UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		
		userId, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "user_id not found in context"})
			return
		}

		var updatedUserData models.User

		if err := c.BindJSON(&updatedUserData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Validate the updated user data
		validationErr := validate.Struct(updatedUserData)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		// Get the user from the database
		var existingUser models.User
		err := userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&existingUser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching user data"})
			return
		}

		existingUser.First_name = updatedUserData.First_name
		existingUser.Last_name = updatedUserData.Last_name
		existingUser.Email = updatedUserData.Email
		existingUser.Phone = updatedUserData.Phone
		existingUser.User_type = updatedUserData.User_type
		existingUser.Updated_at = time.Now()

		
		update := bson.M{"$set": existingUser}
		filter := bson.M{"user_id": userId}

		_, err = userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while updating user"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "updated_user": existingUser})
	}
} 





func ForgotPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel() 
		var resetPasswordEmailRequest models.ForgotPasswordRequest
		if err := c.BindJSON(&resetPasswordEmailRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			defer cancel()
			return
		}

		validationErr := validate.Struct(resetPasswordEmailRequest)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			defer cancel()
			return
		}

		var user models.User
		err := userCollection.FindOne(ctx, bson.M{"email": resetPasswordEmailRequest.Email}).Decode(&user)
		if err != nil {
			// Instead of returning 404, just respond with success message
			c.JSON(http.StatusOK, gin.H{"message": "Reset password email sent successfully"})
			defer cancel()
			return
		}

		
		resetToken, err := utils.GenerateToken(*user.Email)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"message": "Reset password email sent successfully"})
			defer cancel()
			return
		}
		
		// Log the reset token for debugging
		log.Printf("Reset Token: %+v\n", resetToken)
		// Update the user with the reset token in the database
		 
		update := bson.M{"$set": bson.M{"reset_token": resetToken}}
		filter := bson.M{"email": resetPasswordEmailRequest.Email}

		_, err = userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while updating reset token"})
			defer cancel()
			return
		}

		// Send reset password email with the reset token
		err = utils.SendResetPasswordEmail(*user.Email, resetToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while sending reset password email", "details": err.Error()})
			defer cancel()
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Reset password email sent successfully"})
		defer cancel()
	}
}

func ResetPassword() gin.HandlerFunc {
    return func(c *gin.Context) {
        var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
        defer cancel()

        var resetPasswordRequest models.ResetPasswordRequest
        if err := c.BindJSON(&resetPasswordRequest); err != nil {
            log.Printf("Error binding JSON: %v", err)
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        validationErr := validate.Struct(resetPasswordRequest)
        if validationErr != nil {
            log.Printf("Validation error: %v", validationErr)
            c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
            return
        }
		resetToken := c.Query("reset_token")
        if resetToken == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "reset_token parameter is required"})
            return
        }

        claims, err := utils.ParseToken(resetToken)
        if err != nil {
            log.Printf("Error parsing reset token: %v", err)
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired reset token"})
            return
        } 

        log.Printf("Reset password request received for user ID: %s", claims.Subject)

        newHashedPassword := HashPassword(*resetPasswordRequest.NewPassword)
        filter := bson.M{"email": claims.Subject}
        update := bson.M{"$set": bson.M{"password": newHashedPassword}}
        result, err := userCollection.UpdateOne(ctx, filter, update)
        if err != nil {
            log.Printf("Error updating password: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while updating password"})
            return
        }

        log.Printf("Password update result: %+v", result)

        // Check if the password update was successful
        if result.ModifiedCount == 0 {
            c.JSON(http.StatusBadRequest, gin.H{"error": "password not updated"})
            return
        }

        // Fetch and return the updated user details
        updatedUser := models.User{} // Replace with your actual user model
        err = userCollection.FindOne(ctx, bson.M{"email": claims.Subject}).Decode(&updatedUser)
        if err != nil {
            log.Printf("Error fetching updated user details: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching updated user details"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully", "userdetails": updatedUser})
    }
}
