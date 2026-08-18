package com.ttd.lms.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.UUID;

public class ValidUUIDValidator implements ConstraintValidator<ValidUUID, String> {
    
    private boolean allowNull;
    
    @Override
    public void initialize(ValidUUID constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }
        
        if (value.trim().isEmpty()) {
            return false;
        }
        
        try {
            UUID.fromString(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
