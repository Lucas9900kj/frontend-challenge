import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getSavedSession, logout } from "../services/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const session = getSavedSession();

  const userQuery = useQuery({
    queryKey: ["auth", "me", session?.token],
    queryFn: getCurrentUser,
    enabled: Boolean(session),
    retry: false,
    staleTime: 30_000,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    },
  });

  return {
    user: session ? (userQuery.data ?? null) : null,
    isAuthenticated: Boolean(session && userQuery.data),
    isLoading: Boolean(session && userQuery.isPending),
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
