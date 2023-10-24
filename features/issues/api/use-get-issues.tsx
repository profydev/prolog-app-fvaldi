import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getIssues } from "@api/issues";
import type { Page } from "@typings/page.types";
import type { Issue } from "@api/issues.types";

const QUERY_KEY = "issues";

export function getQueryKey(page?: number) {
  if (page === undefined) {
    return [QUERY_KEY];
  }
  return [QUERY_KEY, page];
}

export function useGetIssues(page: number) {
  const query = useQuery<Page<Issue>, Error>({
    queryKey: getQueryKey(page),
    queryFn: ({ signal }) => getIssues(page, { signal }),
    placeholderData: keepPreviousData,
  });

  // Prefetch the next page!
  const queryClient = useQueryClient();
  useEffect(() => {
    if (query.data?.meta.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: getQueryKey(page + 1),
        queryFn: ({ signal }) => getIssues(page + 1, { signal }),
      });
    }
  }, [query.data, page, queryClient]);
  return query;
}
