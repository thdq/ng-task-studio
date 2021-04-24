import { ValidationComposite, RequiredFieldValidation } from "@/presentation/protocols/validation/validators"
import { Validation } from "@/validation/validation"

export const makeCreateTaskListValidation = (): ValidationComposite => {
    
    const validations: Validation[] = []
    
    for (const field of ['title']) {
        
        validations.push(new RequiredFieldValidation(field))
        
    }
    
    return new ValidationComposite(validations)
}
