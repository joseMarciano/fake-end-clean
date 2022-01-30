import { Validator } from '../protocols'

export class ValidationErrorComposite implements Validator {
  public validators: Validator[] = []

  validate (input: any): Error | null {
    for (const validator of this.validators) {
      const error = validator.validate(input)

      if (error) return error
    }

    return null
  }

  static builder (): Builder {
    return new Builder(new ValidationErrorComposite())
  }
}

class Builder {
  constructor (
    private readonly validationErrorComposite: ValidationErrorComposite
  ) {}

  validator (validator: Validator): Builder {
    this.validationErrorComposite.validators.push(validator)
    return this
  }

  build (): ValidationErrorComposite {
    return this.validationErrorComposite
  }
}
