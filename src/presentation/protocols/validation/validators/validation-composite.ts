import { Validation, ValidationError } from "@/validation/validation"

export class ValidationComposite implements Validation {
    private readonly validations: Validation[]

    constructor (validations: Validation[]) {
        this.validations = validations
    }

    validate (input: any): ValidationError {
        
        for (const validation of this.validations) {
            
            const error = validation.validate(input)
            
            if (error) return error
            
        }
    }
}
