export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  service?: string;
  attachedImages?: string[]; // Поддержка одного или нескольких фото
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "Irene L.",
    rating: 5,
    date: "1 abr 2024",
    text: "Todo genial, Lilia es un encanto y muy profesional. Sus manicuras duran muchísimo y siempre tiene los locales impecables.",
    service: "Nivelación + Color (Esmaltado Semipermanente)",
    attachedImages: ["/images/fotoreview1.jpeg"]
  },
  {
    id: 2,
    name: "María J.",
    rating: 5,
    date: "27 mar 2024",
    text: "Como siempre, un trabajo impecable. Lilia es súper meticulosa y perfeccionista. Las uñas quedan preciosas y duran intactas semanas.",
    service: "Manicura Rusa (Limpieza profunda)",
    attachedImages: ["/images/fotoreview2.jpeg"]
  },
  {
    id: 18,
    name: "Sofía C.",
    rating: 5,
    date: "15 mar 2024",
    text: "Me ha encantado el resultado. El trato es inmejorable, la manicura está perfecta y el diseño que le pedí lo hizo a la perfección. 100% recomendable.",
    service: "Manicura con Diseño",
    // Пример трех фото для 18-го отзыва:
    attachedImages: [
      "/images/fotoreview18.1.jpeg",
      "/images/fotoreview18.2.jpeg",
      "/images/fotoreview18.3.jpeg"
    ]
  },
  {
    id: 4,
    name: "Ana P.",
    rating: 5,
    date: "2 feb 2024",
    text: "Las mejores de Valdemoro. Llevo yendo meses y mis uñas naturales por fin están sanas y largas gracias a la nivelación.",
    service: "Nivelación + Esmaltado"
  },
  {
    id: 5,
    name: "Laura V.",
    rating: 5,
    date: "20 ene 2024",
    text: "Hice la formación con Lilia y es la mejor decisión que pude tomar. Explica todo al detalle y te acompaña en el proceso.",
    service: "Formación Privada"
  }
];
