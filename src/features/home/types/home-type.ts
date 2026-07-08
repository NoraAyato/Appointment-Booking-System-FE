export interface HomeCustomerReview {
  id: string;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  visitedAt: string;
}

export interface HomeAboutValue {
  iconType: 'clock' | 'heart' | 'safety' | 'team';
  title: string;
  text: string;
}
