package routes


import (
	 "expendit-server/controllers"
   middleware "expendit-server/middleware"
	"github.com/gin-gonic/gin"
)

func UserRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.Use(middleware.Authenticate())
	incomingRoutes.Use(middleware.AuthMiddleware())
	incomingRoutes.GET("/users",controller.GetUsers())
	incomingRoutes.GET("/users/:user_id",controller.GetUser())
	incomingRoutes.PUT("users/change-password", controller.ChangePassword())
}