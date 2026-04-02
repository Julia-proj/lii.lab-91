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
    name: "Sara C.",
    rating: 5,
    date: "23 mar 2026",
    text: "Trabajo perfecto! Muy detallista y sabe en todo momento que es lo que necesitas. Te aconseja muy bien y muy simpática. Repetiré sin ninguna duda!",
    service: "Manicura",
    attachedImages: ["/images/fotoreview1.jpeg"]
  },
  {
    id: 2,
    name: "Estefania C.",
    rating: 5,
    date: "13 feb 2026",
    text: "Excelente trabajo y dedicación, he ido a otros sitios a atenderme y siempre vuelvo porque nadie trabaja tan al detalle como ella ❤️",
    service: "Manicura"
  },
  {
    id: 3,
    name: "Gretel M.",
    rating: 5,
    date: "16 ene 2026",
    text: "Extremadamente complacida. Muy feliz con mis uñas. El trato inmejorable, la calidad del servicio genial. Altamente recomendada ❤️. Sin dudas regresaré.",
    service: "Manicura",
    attachedImages: ["/images/fotoreview3.jpeg"]
  },
  {
    id: 4,
    name: "Cristina M.",
    rating: 5,
    date: "21 dic 2025",
    text: "Llevo un año haciéndome las uñas con Lili y no puedo estar más feliz. Siempre las deja perfectas, cuida cada detalle y el resultado es perfecto siempre. Además de ser súper profesional, es un amor de persona, te hace sentir cómoda desde el primer momento. La recomiendo totalmente, es una maravilla",
    service: "Manicura"
  },
  {
    id: 5,
    name: "Yaiza P.",
    rating: 5,
    date: "14 nov 2025",
    text: "Todo al detalle, súper perfeccionista y te aconseja lo mejor para tus uñas. Muchas gracias guapa!!",
    service: "Manicura"
  },
  {
    id: 6,
    name: "Sara L.",
    rating: 5,
    date: "8 oct 2025",
    text: "Súper contenta con la manicura. Lili es muy perfeccionista y meticulosa con su trabajo: nunca me habían hecho las uñas tan bien!❤️",
    service: "Manicura"
  },
  {
    id: 7,
    name: "Marta S.",
    rating: 5,
    date: "30 jul 2025",
    text: "Muy contenta tanto con el trato como con el trabajo.Lili es muy profesional y me gusta mucho como trabaja.Nunca me habían hecho una manicura tan perfecta.Salgo encantada.",
    service: "Manicura"
  },
  {
    id: 8,
    name: "Leticia M.",
    rating: 5,
    date: "7 jul 2025",
    text: "Genial! Es la primera vez que he ido. Llevaba las uñas destrozadas porque me había arrancado el esmalte que llevaba antes y me las ha dejado preciosas.",
    service: "Manicura",
    attachedImages: ["/images/fotoreview8.jpeg"]
  },
  {
    id: 9,
    name: "Elena J.",
    rating: 5,
    date: "2 jul 2025",
    text: "Lili es increíble! No he visto a nadie que trabaje como ella y haga que me aguanten tanto las uñas",
    service: "Manicura"
  },
  {
    id: 10,
    name: "Sandra F.",
    rating: 5,
    date: "27 may 2025",
    text: "Llevo apenas 3 meses yendo con ella y ya ha logrado que mis uñas estén largas, sanas y más fuertes que nunca. Nunca antes me las habían cuidado ni hecho tan bien. Es detallista, profesional y se nota que le apasiona su trabajo. ¡La recomiendo totalmente!",
    service: "Manicura"
  },
  {
    id: 11,
    name: "Carmen CV",
    rating: 5,
    date: "7 abr 2025",
    text: "Encantada con mis uñas. Nunca me las había visto tan bonitas. Lili hace magia en las manos. Gracias gracias gracias!!! ☺️",
    service: "Manicura"
  },
  {
    id: 12,
    name: "Naomi Luisa F.",
    rating: 5,
    date: "28 mar 2025",
    text: "La atmósfera fue acogedora y relajante y la decoración elegante con un ambiente limpio. El servicio fue excelente y el resultado final fue exactamente lo que esperaba. Recomendado 100%.",
    service: "Manicura"
  },
  {
    id: 13,
    name: "Ana V.",
    rating: 5,
    date: "19 mar 2025",
    text: "Lili es una excelente profesional. El trabajo es impecable. Ambiente muy agradable y materiales de 1a calidad. Encantada con ella.",
    service: "Manicura",
    attachedImages: ["/images/fotoreview13.jpeg"]
  },
  {
    id: 14,
    name: "Pilar B.",
    rating: 5,
    date: "19 mar 2025",
    text: "Muy contenta. Todo puntual. Lili es realmente una artista de las uñas. He comprendido que la manicura no tiene por qué doler por primera vez en años y ya creo que con eso os estoy sugiriendo muchas cosas. Volveré.",
    service: "Manicura",
    attachedImages: ["/images/fotoreview14.jpeg"]
  },
  {
    id: 15,
    name: "Laura V.",
    rating: 5,
    date: "18 mar 2025",
    text: "Mi experiencia ha sido fantástica,entender  del cuidado y embellecimiento de las manos en especial,el cuidado de las uñas y pintura no lo había visto nunca.\nGracias por haberme hecho unas manos y uñas Preciosas. Una gran profesional!!!!",
    service: "Manicura"
  },
  {
    id: 16,
    name: "Nataliia S.",
    rating: 5,
    date: "4 nov 2024",
    text: "La mejor manicura que me han hecho 👌\nLili es una gran profesional y una chica muy maja. Lo hace todo perfecto y rápido. Una recomendación 100 %",
    service: "Manicura"
  },
  {
    id: 17,
    name: "Natalia Gil V.",
    rating: 5,
    date: "3 ene 2025",
    text: "Es la mejor manicurista de Madrid sin duda alguna, por su perfeccionismo, su trato, sus cuidados y mimos, y por muchas cosas más 💜 no hay nada que haga mal ✨",
    service: "Manicura",
    attachedImages: ["/images/fotoreview17.jpeg"]
  },
  {
    id: 18,
    name: "Miriam T.",
    rating: 5,
    date: "6 mar 2025",
    text: "Lili es genial en todos los aspectos. Trabajo limpio y al detalle. Si buscas la perfección y profesionalidad con ella lo tienes asegurado. 🫶",
    service: "Manicura",
    attachedImages: [
      "/images/fotoreview18.1.jpeg",
      "/images/fotoreview18.2.jpeg",
      "/images/fotoreview18.3.jpeg"
    ]
  },
  {
    id: 19,
    name: "Laura R.",
    rating: 5,
    date: "1 jun 2024",
    text: "Lo que mas me ha gustado es la higiene que hay en su centro y la finura y perfección en la realizacion del trabajo.",
    service: "Manicura",
    attachedImages: ["/images/fotoreview19.jpeg"]
  },
  {
    id: 20,
    name: "Olga C.",
    rating: 5,
    date: "22 may 2024",
    text: "Encantada con la atención y servicio, es la segunda vez que voy y estoy fascinada 100 de 100 para lii.lab. Mis manos y pies quedaron bellas",
    service: "Manicura",
    attachedImages: ["/images/fotoreview20.jpeg"]
  },
  {
    id: 21,
    name: "Laura M.",
    rating: 5,
    date: "19 mar 2024",
    text: "Estoy encantada con mi nueva manicura. Lilia es una profesional increíble. Deja las uñas perfectas y finitas, cosa que hoy es muy difícil encontrar hoy en día ¡Volveré seguro!",
    service: "Manicura",
    attachedImages: ["/images/fotoreview21.jpeg"]
  },
  {
    id: 22,
    name: "Lucia J.",
    rating: 5,
    date: "28 feb 2024",
    text: "Fui con un destrozo de uñas de otro centro y me las ha dejado espectacular! Súper profesional y perfeccionista, sin duda ya será mi manicurista de confianza 😍",
    service: "Manicura",
    attachedImages: ["/images/fotoreview22.jpeg"]
  }
];
