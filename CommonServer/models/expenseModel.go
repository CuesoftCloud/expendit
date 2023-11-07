package models 

import (
	"gorm.io/gorm"
    "time"
)

type Expense struct {
	gorm.Model
	Amount      int  `gorm:"size:255;not null;unique" json:amount`
    Date        time.Time
    Category    ExpenseCategory
    Description string  `gorm:size:255;not null; unique" json:description`  
    UserID      uint
}