
export const paths = {
    home: {
        path: "/",
        getHref: () => "/",
    },
    aboutus: {
        path: "/about-us",
        getHref: () => "/about-us",
    },
    login: {
        path: "/login",
        getHref: () => "/login",
    },
    forgotpassword: {
        path: "/forgot-password",
        getHref: () => "/forgot-password",
    },
    signup: {
        path: "/sign-up",
        getHref: () => "/sign-up",
    },
    contactus: {
        path: "/contact-us",
        getHref: () => "/contact-us",
    },
    calculate:{
        path: "/calculate",
        getHref: () => "/calculate",
    },
    mycart: {
        path: "/my-cart",
        getHref: () => "/my-cart",
    },
    product: {
        path: "/products",
        getHref: () => "/products", 

        category: {
            path: "/products/category/:id",
            getHref: (id: string) => `/products/category/${id}`,
        },

        details: {
            path: "/products/:slug",
            getHref: (slug: string) => `/products/${slug}`,
        },
    },
    installation: {
        path: "/installation",
        getHref: () => "/installation",

        details: {
            path: "/installation/:slug",
            getHref: (slug: string) => `/installation/${slug}`,
        },

    },

    privacyPolicy: {
        path: "/privacy-policy",
        getHref: () => "/privacy-policy",
    },
    termsandconditions: {
        path: "/terms-and-conditions",
        getHref: () => "/terms-and-conditions",
    },

} as const;
