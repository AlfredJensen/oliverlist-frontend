export const linksMixin = {
    methods: {
        setTargetBlank: async function(loading, divElem, sleep) {			
			if(!loading){
				await sleep(1);
				let eles = document.getElementsByClassName(divElem);
				let links = eles[0].getElementsByTagName("a");
				for(var i = 0; i < links.length; i++){
					links[i].setAttribute("target", "_blank");
				}
			}
		},
    }
}