import { ValidationComposite, RequiredFieldValidation } from "@/presentation/protocols/validation/validators"
import { Validation } from "@/validation/validation"
import { makeCreateTaskListValidation } from './create-task-list'

jest.mock('../../../presentation/protocols/validation/validators/validation-composite')

describe('CreateTaskListValidation Factory', () => {
    
    test('Should call ValidationComposite with all validatations', () => {
        
        makeCreateTaskListValidation()
        
        const validations: Validation[] = []
        
        for (const field of ['title']) {
            
            validations.push(new RequiredFieldValidation(field))
            
        }
        
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
