import { MissingParamsError } from '@/data/errors/missing-params-error'
import { Validation, ValidationError } from '@/validation/validation'

export class RequiredFieldValidation implements Validation {
    private readonly fieldName: string

    constructor (fieldName: string) {
        this.fieldName = fieldName
    }

    validate (input: any): ValidationError {
        
        if (!input[this.fieldName]) {
            
            return {
                error: new MissingParamsError(this.fieldName),
                failedField: this.fieldName
            }
            
        }
        
    }
}
