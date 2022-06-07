export const tabsMixin = {
    methods: {
        restrictedAccess: function() {
			this.$swal({
				type: "warning",
				html: this.$t('lang.label.restrictedaccess'),
				showCancelButton: false,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33a2c",
				confirmButtonText: this.$t('lang.button.ok')
			  })
		},
    }
}