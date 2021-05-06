window.theme = window.theme || {}

theme.utils = (function () {
	const showToast = (message, type) => {
		nativeToast({
			message,
			timeout: 5000,
			rounded: true,
			position: "south",
			closeOnClick: true,
			type: typeof type !== "undefined" ? type : "success",
		})
	}

	const init = () => {
		// https://****.myshopify.com/challenge
		if ($(".shopify-challenge__button")) {
			$(this).addClass("primary")
			$(".shopify-challenge__button").addClass("primary")
		}

		$(".click").click(function (e) {
			e.preventDefault()
		})
	}
	return {
		init,
		showToast,
	}
})()

theme.cart = (function () {
	const updateCart = async ($item) => {
		try {
			let response = await fetch("/cart/change.js", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quantity: $item.val(), id: $item.data("item-key") }),
			})
			if (!response.ok) {
				throw new Error("Update cart request error!")
			}
			if ($item.val() > 0) {
				theme.utils.showToast("Quantity changed!")
				openCart()
			} else {
				theme.utils.showToast("Deleted!")
				openCart()
			}
		} catch (e) {
			console.error("Update cart error", e)
			const error = JSON.parse(e.responseText)
			if (error.status == 422) {
				theme.utils.showToast("Out Of Stock!", "error")
			} else {
				theme.utils.showToast("Update cart error!", "error")
			}
		}
	}
	const addToCart = async (formData) => {
		try {
			const response = await fetch("/cart/add.js", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
			if (!response.ok) {
				throw response
			}
			console.log("Successed!")
			theme.utils.showToast("Added!")
			openCart()
			return await response.json()
		} catch (e) {
			console.error("Add to cart failed", e)
			if (e.status == 422) {
				theme.utils.showToast("Out Of Stock!", "error")
			} else {
				theme.utils.showToast("Add to cart failed!", "error")
			}
		}
	}
	const openCart = function () {
		$(".cart").addClass("active")
		$(".cart .content-loader").empty().append(`<div class="ring-loader"><div></div><div></div><div></div><div></div></div>`)
		$(".cart .content-loader").load("/cart?view=ajax", function () {
			const cartJson = JSON.parse($(".content-loader").find("#cartJSON").text())
			$(".item_count").text(cartJson.item_count)
			// commands here
			$("[data-remove-item-cart]").click(function (e) {
				e.preventDefault()
				updateCart($(this))
			})
		})
	}
	const init = function () {
		$("[data-add-to-cart]").click(function (e) {
			e.preventDefault()
			const formData = {
				items: [
					{
						id: $(".product-variants").find("input[name='id']:checked").val(),
						quantity: $(".product-variants").find("input[name='quantity']").val(),
					},
				],
			}
			addToCart(formData)
		})

		$("[data-toggle-cart]").click(function (e) {
			e.preventDefault()
			$(".cart").hasClass("active") ? $(".cart").removeClass("active") : openCart()
		})
	}
	return {
		init,
		addToCart,
	}
})()

theme.carouseles = (function () {
	// owl.carousel
	const owlCarouseles = [
			{
				selector: "#product-slider",
				getSettings: function () {
					return {
						nav: $(this.selector).data("nav"),
						dots: $(this.selector).data("dots"),
						loop: $(this.selector).data("loop"),
						items: $(this.selector).data("items"),
						autoplay: $(this.selector).data("autoplay"),
						autoplayHoverPause: true,
						navText: ["<span></span>", "<span></span>"],
						dotsContainer: "#product-slider-dots",
						onInitialized: function (event) {
							const target = event.target.id ? event.target.id : event.target.classList[0]
							console.log(`${target} has been initialized.`)
							$("#product-slider-dots .owl-dot").click(function () {
								$("#product-slider").trigger("to.owl.carousel", [$(this).index(), 300])
							})
						},
					}
				},
			},
			{
				selector: "#recommendations-slider",
				getSettings: function () {
					return {
						autoplayHoverPause: true,
						navText: ["<span></span>", "<span></span>"],
						margin: 20,
						responsive: {
							1023: {
								loop: $(this.selector).data("loop"),
								autoplay: $(this.selector).data("autoplay"),
								items: $(this.selector).data("items"),
								nav: $(this.selector).data("nav"),
								dots: $(this.selector).data("dots"),
							},
							639: {
								items: 2,
							},
							300: {
								items: 1,
								center: true,
								stagePadding: 50,
								dots: true,
							},
						},
						onInitialized: function (event) {
							const target = event.target.id ? event.target.id : event.target.classList[0]
							console.log(`${target} has been initialized.`)
						},
					}
				},
			},
		],
		initializeOwlCarousel = (carousel) => ($(carousel.selector).length > 0 ? $(carousel.selector).owlCarousel(carousel.getSettings()) : false)
	function reInitializeOwlCarousel(selector) {
		$(selector).trigger("destroy.owl.carousel")
		initializeOwlCarousel(owlCarouseles.filter((carousel) => carousel.selector == selector)[0])
	}

	// swiper
	// const swiperCarouseles = [
	// 	{
	// 		selector: "#index-slider-1",
	// 		getSettings: function () {
	// 			return {
	// 				direction: "vertical",
	// 				slidesPerView: 1,
	// 				spaceBetween: 0,
	// 				speed: 1000,
	// 				invert: true,
	// 				simulateTouch: false,
	// 				mousewheel: {
	// 					invert: true,
	// 				},
	// 				effect: "coverflow",
	// 				coverflowEffect: {
	// 					rotate: 100,
	// 				},
	// 				on: {
	// 					init: function (swiper) {
	// 						console.log(`Swiper #${swiper.el.id} has been initialized.`)
	// 						theme.indexSliderOne = swiper
	// 					},
	// 					afterInit: function (swiper) {
	// 						// slide to last slide after initializing
	// 						swiper.slideTo(swiper.slides.length - 1, 0, false)
	// 					},
	// 					scroll: function (swiper, event) {
	// 						// slide on scroll
	// 						if (event.deltaY > 0) {
	// 							window.theme.indexSliderTwo.slideNext(swiper.params.speed, true)
	// 						} else if (event.deltaY < 0) {
	// 							window.theme.indexSliderTwo.slidePrev(swiper.params.speed, true)
	// 						}
	// 					},
	// 				},
	// 			}
	// 		},
	// 	},
	// ]
	// initializeSwiperCarousel = (carousel) => ($(carousel.selector).length > 0 ? new Swiper(carousel.selector, carousel.getSettings()) : false)
	// reInitializeSwiperCarousel = (selector) => {
	// 	console.log("Need to fix")
	// }

	// Initializing
	const init = function () {
		owlCarouseles.forEach(initializeOwlCarousel)
		// swiperCarouseles.forEach(initializeSwiperCarousel)
	}
	return {
		init,
		reInitializeOwlCarousel,
		// reInitializeSwiperCarousel,
	}
})()

theme.loadProductRecomendations = async function () {
	//-- Recommendations on product page
	const $container = $(".recommendations")
	const $section = $container.parent().parent()

	if ($container.length > 0) {
		const baseUrl = $container.data("base-url")
		const productId = $container.data("product-id")
		const sectionId = $container.data("section-id")
		const limit = $container.data("limit")
		const requestURL = `${baseUrl}?section_id=${sectionId}&limit=${limit}&product_id=${productId}`

		try {
			$container.replaceWith(`<div class="ring-loader"><div></div><div></div><div></div><div></div></div>`)
			let response = await fetch(requestURL, { method: "GET" })
			if (!response.ok) {
				throw new Error("Failed to load product recommendations.")
			}
			response = await response.text()
			$section.replaceWith(response)
			theme.carouseles.reInitializeOwlCarousel("#recommendations-slider")
			console.log("Recommended products loaded.")
		} catch (e) {
			console.error(e.message)
		}
	}
}

theme.customizer = (function () {
	if (Shopify.designMode) {
		document.addEventListener("shopify:section:load", function (event) {
			console.log("shopify:section:load triggered.")
			if ($(event.target).hasClass("shopify-product-template")) {
				theme.carouseles.reInitializeOwlCarousel("#product-slider")
			}

			if ($(event.target).hasClass("shopify-index-template")) {
				theme.carouseles.reInitializeSwiperCarousel("#index-slider-1")
			}

			if ($(event.target).hasClass("product-recommendations")) {
				theme.carouseles.reInitializeOwlCarousel("#recommendations-slider")
				theme.loadProductRecomendations()
			}
		})
		// document.addEventListener("shopify:section:unload", function (event) {
		// 	console.log("shopify:section:unload triggered.")
		// })
		// document.addEventListener("shopify:section:select", function (event) {
		// 	console.log("shopify:section:select triggered.")
		// })
		// document.addEventListener("shopify:section:deselect", function (event) {
		// 	console.log("shopify:section:deselect triggered.")
		// })
		// document.addEventListener("shopify:section:reorder", function (event) {
		// 	console.log("shopify:section:reorder triggered.")
		// })
		// document.addEventListener("shopify:block:select", function (event) {
		// 	console.log("shopify:block:select triggered.")
		// })
		// document.addEventListener("shopify:block:deselect", function (event) {
		// 	console.log("shopify:block:deselect triggered.")
		// })
	}
})()

theme.init = function () {
	theme.utils.init()
	theme.cart.init()
	theme.carouseles.init()
	theme.loadProductRecomendations()
}

$(function () {
	theme.init()
})

$(window).on("load", function () {
	console.log("DOM has been loaded.")
	$("#page-preloader").fadeOut("slow")
})