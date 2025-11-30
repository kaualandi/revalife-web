import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Exemplo de configuração de queries e mutations

// Função de fetch genérica
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Exemplo de hook de query
export function useExample() {
  return useQuery({
    queryKey: ['example'],
    queryFn: () => fetchData<{ data: string }>('/api/example'),
  });
}

// Exemplo de hook de mutation
export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas após sucesso
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });
}
