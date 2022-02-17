import { MissingParamError } from '../errors/MissingParamError'
import { Validator } from '../protocols'

export class RequiredFieldValidation implements Validator {
  private fieldName: string

  validate (input: any): Error | null {
    return input[this.fieldName] ? null : new MissingParamError(this.fieldName)
  }

  static builder (): Builder {
    return new Builder(new RequiredFieldValidation())
  }

  set field (fieldName: string) {
    this.fieldName = fieldName
  }

  get field (): string {
    return this.fieldName
  }
}

class Builder {
  constructor (
    private readonly requiredFieldValidation: RequiredFieldValidation
  ) {}

  field (fieldName: string): Builder {
    this.requiredFieldValidation.field = fieldName
    return this
  }

  build (): RequiredFieldValidation {
    return this.requiredFieldValidation
  }
}
