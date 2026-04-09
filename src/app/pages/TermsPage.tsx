import { Scale } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';

const sections = [
  {
    title: '1. Objeto',
    body:
      'WOHL es una aplicaciÃ³n destinada al registro, organizaciÃ³n y seguimiento personal de entrenamientos, rutinas, ejercicios, mÃ©tricas y notas asociadas a la actividad fÃ­sica del usuario.',
  },
  {
    title: '2. Uso personal',
    body:
      'La app estÃ¡ pensada para uso personal y no exclusivo. El usuario es responsable de la informaciÃ³n que carga, de la confidencialidad de su cuenta y del uso que realice de las funciones disponibles.',
  },
  {
    title: '3. Datos y contenidos cargados',
    body:
      'El usuario conserva la titularidad sobre los datos que ingresa en WOHL, incluyendo rutinas, pesos, repeticiones, notas, historial y perfil. WOHL utiliza esos datos para operar correctamente y mejorar la experiencia dentro de la aplicaciÃ³n.',
  },
  {
    title: '4. Salud y entrenamiento',
    body:
      'WOHL no reemplaza asesoramiento mÃ©dico, nutricional, kinÃ©sico ni de entrenamiento profesional. Toda decisiÃ³n sobre cargas, ejercicios, recuperaciÃ³n o alimentaciÃ³n debe ser evaluada por el usuario segÃºn su contexto y, cuando corresponda, con acompaÃ±amiento profesional.',
  },
  {
    title: '5. Disponibilidad del servicio',
    body:
      'Se procura mantener la app operativa, pero pueden existir interrupciones, cambios, mantenimiento, errores o mejoras evolutivas que afecten temporalmente su funcionamiento. Algunas funciones pueden agregarse, modificarse o eliminarse con el tiempo.',
  },
  {
    title: '6. Seguridad y acceso',
    body:
      'El usuario debe elegir una contraseÃ±a segura y mantenerla bajo reserva. WOHL no serÃ¡ responsable por accesos no autorizados derivados del uso negligente de las credenciales por parte del usuario.',
  },
  {
    title: '7. LimitaciÃ³n de responsabilidad',
    body:
      'Dentro del marco permitido por la normativa aplicable, WOHL y su titular no asumen responsabilidad por daÃ±os directos o indirectos derivados del uso, interrupciÃ³n, pÃ©rdida de datos, decisiones de entrenamiento o resultados fÃ­sicos obtenidos a partir del uso de la app.',
  },
  {
    title: '8. Propiedad intelectual',
    body:
      'La marca WOHL, su diseÃ±o visual, estructura de navegaciÃ³n, textos generales y materiales propios de la aplicaciÃ³n pertenecen a su titular, salvo contenidos o recursos de terceros debidamente identificados.',
  },
  {
    title: '9. Modificaciones',
    body:
      'Estos tÃ©rminos pueden actualizarse cuando resulte necesario. La continuidad en el uso de WOHL despuÃ©s de una modificaciÃ³n implica la aceptaciÃ³n de la versiÃ³n vigente publicada en la aplicaciÃ³n.',
  },
  {
    title: '10. Ley aplicable y jurisdicciÃ³n',
    body:
      'Estos tÃ©rminos se interpretan conforme a las leyes de la RepÃºblica Argentina. Cualquier controversia vinculada al uso de WOHL serÃ¡ sometida a la jurisdicciÃ³n de los tribunales competentes de la RepÃºblica Argentina, salvo disposiciÃ³n legal en contrario.',
  },
];

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="TÃ©rminos y condiciones" onBack={() => navigate('/config')} />

      <div className="flex flex-col gap-6 px-4 py-5 pb-7 sm:px-5 sm:py-6">
        <div className="rounded-3xl border border-[rgba(0,201,167,0.14)] bg-[rgba(0,201,167,0.06)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(0,201,167,0.12)]">
              <Scale size={20} className="text-[#00C9A7]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-white">Condiciones generales de uso</h1>
              <p className="mt-2 text-sm leading-6 text-[#C8C8C8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Texto informativo general adaptado al uso de WOHL y al marco legal argentino. Ãšltima actualizaciÃ³n: 7 de abril de 2026.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-3xl bg-[#13263A] p-5">
              <h2 className="text-xl font-bold tracking-tight text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#D4D4D4]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
