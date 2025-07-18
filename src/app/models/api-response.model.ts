export interface ApiResponse {
    data: any[];
    pagination: {
        page: number;
        page_size: number;
        total_pages: number;
        length: number;
    }
}
