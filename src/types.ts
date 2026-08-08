export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  certified: boolean;
  liveUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  description: string;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: {
    text: string;
    type: 'free' | 'languages' | 'primary' | 'success';
  };
  duration: string;
  lessonsCount: number;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  requirements: string[];
  benefits?: string[];
  createdAt?: string;
}

export interface Consultation {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  date: string;
  time: string;
  details?: string;
}
