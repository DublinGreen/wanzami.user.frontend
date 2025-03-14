import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2, // Retry failed requests twice
        refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      },
    },
  });
  
  export default {
    install(app) {
      app.use(VueQueryPlugin, { queryClient });
    },
  };