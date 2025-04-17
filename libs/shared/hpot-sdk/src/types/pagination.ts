export type PageRequest = {
  direction: 'next' | 'prev';
  cursor?: string;
  pageNum?: number;
  orderBy?: string;
  orderDirection?: string;
};
