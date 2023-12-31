package models


import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Category struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Name      string             `json:"name" validate:"required,min=1,max=500"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}