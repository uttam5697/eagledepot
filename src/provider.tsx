import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { MainErrorFallback } from "./components/error/main";
import { createAppRouter } from "./router";
import { UserProvider } from "./components/context/UserContext";
import StripeProviderWrapper from "./components/StripeProviderWrapper";

const queryClient = new QueryClient();

const AppProvider = () => {
    return (
        <React.Suspense >
            <ErrorBoundary FallbackComponent={MainErrorFallback}>
                <QueryClientProvider client={queryClient}>
                    {/* <SmoothScrollbar> */}
                    <StripeProviderWrapper>
                        <UserProvider>
                            <HelmetProvider>
                                <RouterProvider router={createAppRouter} />
                            </HelmetProvider>
                        </UserProvider>
                    </StripeProviderWrapper>
                    {/* </SmoothScrollbar> */}
                </QueryClientProvider>
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default AppProvider;
