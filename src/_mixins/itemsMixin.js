export const itemsMixin = {
  methods: {
    addItem(model, current, uniqueValue, formRefs) {
      let isValid = this.validateForms(formRefs);
      if(!isValid){
        return;
      }

      let value = this.getItemValue(model);

      let index = value.findIndex(
        (item) => item[uniqueValue] === this[current][uniqueValue]
      );

      if (index == -1) {
        value.push(JSON.parse(JSON.stringify(this[current])));
      }

      let cleanFormValue = this[current+'Init'] != undefined ? JSON.parse(JSON.stringify(this[current+'Init'])) : {};
      this[current] = cleanFormValue;

      if(this[current+'Key'] !== undefined){
        this[current+'Key']++;
      }
    },

    editItem(model, index, current) {
      if(this[current+'Wrapper'] !== undefined){
        this[current+'Wrapper'] = true;
      }

      let value = this.getItemValue(model);
      this[current] = value[index];

      if(this[current+'Key'] !== undefined){
        this[current+'Key']++;
      }
    },

    removeItem(model, index) {
      let value = this.getItemValue(model);
      value.splice(index, 1);
    },

    getItemValue(model){
      let modelVar = model.split('.');
      let value = this;
      modelVar.forEach((item) => {
        if(value[item] === undefined || value[item] === null){
          value[item] = [];
        }
        value = value[item];
      });
      return value;
    },

    validateForms(formRefs){
      formRefs = formRefs.split(',');
      let isValid = true;
      formRefs.forEach((formRef) => {
        this.$refs[formRef].validate();
        isValid = isValid && this.$refs[formRef].errors.length == 0;
      });
      return isValid;
    }
  }
}