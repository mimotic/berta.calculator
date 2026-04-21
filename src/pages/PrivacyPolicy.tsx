import { Link } from 'react-router'

const txt = "text-sm font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed"
const heading2 = "text-base font-semibold tracking-wide uppercase text-[#1a1a18] dark:text-[#e8e6e0]"
const heading3 = "text-sm font-semibold tracking-wide uppercase text-[#1a1a18] dark:text-[#e8e6e0]"

function InfoBasica({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      {rows.map(([label, value]) => (
        <>
          <dt key={label + '-dt'} className={`${txt} font-semibold`}>{label}:</dt>
          <dd key={label + '-dd'} className={txt}>{value}</dd>
        </>
      ))}
    </dl>
  )
}

function ResponsableBlock() {
  return (
    <ul className={`${txt} space-y-0.5 list-none`}>
      <li>RED MOUNTAIN LABS, SL</li>
      <li>B88368352</li>
      <li>PASEO DE LA CASTELLANA, 200 – 28046 – Madrid – MADRID</li>
      <li>919047055</li>
      <li>hello@mimotic.com</li>
    </ul>
  )
}

function DerechosSection() {
  return (
    <section className="space-y-3">
      <h3 className={heading3}>7. ¿Cuáles son sus derechos cuando nos facilita sus datos?</h3>
      <p className={txt}>
        Cualquier persona tiene derecho a obtener confirmación sobre si en RED MOUNTAIN LABS, SL estamos tratando, o no, datos personales que les conciernan.
      </p>
      <p className={txt}>
        Las personas interesadas tienen derecho a acceder a sus datos personales, así como a solicitar la rectificación de los datos inexactos o, en su caso, solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos. Igualmente tiene derecho a la portabilidad de sus datos.
      </p>
      <p className={txt}>
        En determinadas circunstancias, los interesados podrán solicitar la limitación del tratamiento de sus datos, en cuyo caso únicamente los conservaremos para el ejercicio o la defensa de reclamaciones.
      </p>
      <p className={txt}>
        En determinadas circunstancias y por motivos relacionados con su situación particular, los interesados podrán oponerse al tratamiento de sus datos. En este caso, RED MOUNTAIN LABS, SL dejará de tratar los datos, salvo por motivos legítimos imperiosos, o el ejercicio o la defensa de posibles reclamaciones.
      </p>
      <p className={txt}>
        Podrá ejercitar materialmente sus derechos de la siguiente forma: dirigiéndose a hello@mimotic.com.
      </p>
      <p className={txt}>
        Cuando se realice el envío de comunicaciones comerciales utilizando como base jurídica el interés legítimo del responsable, el interesado podrá oponerse al tratamiento de sus datos con ese fin.
      </p>
      <p className={txt}>
        Si ha otorgado su consentimiento para alguna finalidad concreta, tiene derecho a retirar el consentimiento otorgado en cualquier momento, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.
      </p>
      <p className={txt}>
        En caso de que sienta vulnerados sus derechos en lo concerniente a la protección de sus datos personales, especialmente cuando no haya obtenido satisfacción en el ejercicio de sus derechos, puede presentar una reclamación ante la Autoridad de Control en materia de Protección de Datos competente a través de su sitio web: www.aepd.es.
      </p>
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 px-6 py-12 transition-colors">
      <div className="max-w-2xl mx-auto space-y-12">
        <Link to="/" className="text-xs font-mono text-[#5B8DEF] hover:underline mb-8 inline-block">← Volver</Link>
        <h1 className="text-[28px] font-normal tracking-tight">Política de privacidad</h1>

        {/* ── CANDIDATOS ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos de candidatos a un puesto de trabajo</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Realizar los procesos de selección de personal.'],
              ['Legitimación', 'Ejecución de un contrato.'],
              ['Destinatarios', 'No se cederán datos a terceros, salvo obligación legal.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de gestionar los Curriculums Vitae recibidos y realizar los procesos de selección de personal, entrevistas y demás trámites necesarios para la búsqueda del mejor candidato posible a un puesto de trabajo determinado. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Dos años desde la última interacción.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Ejecución de un contrato: Gestión de los Curriculums Vitae entregados por el candidato para realizar los procesos de selección de personal para la búsqueda del mejor candidato posible a un puesto de trabajo determinado. (RGPD art. 6.1.b).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>No se cederán datos a terceros, salvo obligación legal.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>

        {/* ── CLIENTES ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos de clientes</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Prestar los servicios solicitados y enviar comunicaciones promocionales.'],
              ['Legitimación', 'Ejecución de un contrato. Interés legítimo del Responsable.'],
              ['Destinatarios', 'Están previstas cesiones de datos a: Administración Tributaria; Entidades financieras. Están previstas transferencias a terceros países.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de realizar la gestión administrativa, contable y fiscal de los servicios solicitados, así como enviar comunicaciones promocionales sobre nuestros productos y servicios. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Los datos se conservarán mientras el interesado no solicite su supresión, y en su caso, durante los años necesarios para cumplir con las obligaciones legales.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Ejecución de un contrato: Gestión fiscal, contable y administrativa de clientes. (RGPD art. 6.1.b).</li>
              <li>Interés legítimo del Responsable: Envío de comunicaciones promocionales incluso por vía electrónica. (RGPD Considerando 47, LSSICE art. 21.2).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>Los datos se comunicarán a los siguientes destinatarios:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Administración Tributaria, con la finalidad de cumplir con las obligaciones legales (requisito legal).</li>
              <li>Entidades financieras, con la finalidad de girar los recibos correspondientes (requisito contractual).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>Están previstas las siguientes transferencias de datos a terceros países:</p>
            <ul className={`${txt} list-disc list-inside space-y-2`}>
              <li>AMAZON WEB SERVICES, INC., con la finalidad de Hosting y correo electrónico. La garantía para esta transferencia se ha establecido a través de: Cláusulas tipo de protección de datos.</li>
              <li>ATLASSIAN NETWORK SERVICES, INC., con la finalidad de Almacenamiento de datos. La garantía para esta transferencia se ha establecido a través de: Cláusulas tipo de protección de datos.</li>
              <li>CLOUDFLARE, INC, con la finalidad de Alojamiento de datos. La garantía para esta transferencia se ha establecido a través de: Cláusulas tipo de protección de datos.</li>
              <li>GOOGLE IRELAND, LTD, con la finalidad de Servicio de alojamiento de datos, hosting, correo electrónico. La garantía para esta transferencia se ha establecido a través de: Cláusulas tipo de protección de datos.</li>
            </ul>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>

        {/* ── PROTOCOLO ACOSO ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos de las partes implicadas en el protocolo para la prevención del acoso sexual o por razón de sexo</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Gestionar el protocolo para la prevención del acoso sexual o por razón de sexo.'],
              ['Legitimación', 'Cumplimiento de una obligación legal.'],
              ['Destinatarios', 'Están previstas cesiones de datos a: Fuerzas y cuerpos de la Seguridad del Estado; Organismos Jurisdiccionales; Ministerio Fiscal.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'De la denuncia presentada por la persona que ha sufrido el acoso u otras personas.'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de gestión del protocolo para la prevención del acoso sexual o por razón de sexo; regulación del procedimiento, gestión de la denuncia, recogida de datos personales y entrevistas con las partes afectadas. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Los datos se suprimirán a los dos años, salvo que sea necesaria su conservación para determinar las posibles responsabilidades que se pudieran derivar ante las posibles reclamaciones efectuadas por los afectados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Cumplimiento de una obligación legal: Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres (art. 48); Real Decreto 901/2020, de 13 de octubre; Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales (art. 14).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>Los datos se comunicarán a los siguientes destinatarios:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Fuerzas y cuerpos de la Seguridad del Estado; Organismos Jurisdiccionales; Ministerio Fiscal, con la finalidad de denunciar la comisión de un posible delito (requisito legal).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: De la denuncia presentada por la persona que ha sufrido el acoso u otras personas.</p>
            <p className={txt}>Las categorías de datos que se tratan son:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Datos identificativos.</li>
              <li>Se tratan las siguientes categorías de datos especiales: datos relativos a la salud.</li>
            </ul>
          </section>
        </div>

        {/* ── POTENCIALES CLIENTES ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos de potenciales clientes y contactos</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Atender su solicitud y enviarle comunicaciones promocionales.'],
              ['Legitimación', 'Ejecución de un contrato. Consentimiento del interesado. Interés legítimo del Responsable.'],
              ['Destinatarios', 'No se cederán datos a terceros, salvo obligación legal.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de realizar la gestión de potenciales clientes que se han interesado sobre nuestros productos y/o servicios, así como otros contactos comerciales y realizar, en su caso, el envío de comunicaciones promocionales, inclusive por vía electrónica. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Los datos se conservarán mientras el interesado no solicite su supresión.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Ejecución de un contrato: Gestión de potenciales clientes que se han interesado sobre nuestros productos y/o servicios. (RGPD, art. 6.1.b).</li>
              <li>Consentimiento del interesado: Enviar comunicaciones promocionales, inclusive por vía electrónica. (RGPD, art. 6.1.a, LSSICE art.21).</li>
              <li>Interés legítimo del Responsable: Gestión de los datos de contacto profesionales (LOPDGDD art.19, RGPD art. 6.1.f).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>No se cederán datos a terceros, salvo obligación legal.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>

        {/* ── PROVEEDORES ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos de proveedores</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Gestionar la prestación de los servicios contratados.'],
              ['Legitimación', 'Ejecución de un contrato. Interés legítimo del Responsable.'],
              ['Destinatarios', 'Están previstas cesiones de datos a: Administración Tributaria; Entidades financieras.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de realizar la gestión fiscal, contable y administrativa de proveedores así como los datos de contacto profesionales. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Los datos se conservarán mientras el interesado no solicite su supresión, y en su caso, durante los años necesarios para cumplir con las obligaciones legales.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Ejecución de un contrato: Realizar la gestión administrativa, contable y fiscal de los servicios contratados. (RGPD art. 6.1.b).</li>
              <li>Interés legítimo del Responsable: Gestión de los datos de contacto profesionales. (LOPDGDD art.19, RGPD art. 6.1.f).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>Los datos se comunicarán a los siguientes destinatarios:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Administración Tributaria, con la finalidad de cumplir con las obligaciones legales (requisito legal).</li>
              <li>Entidades financieras, con la finalidad de realizar los pagos correspondientes (requisito contractual).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>

        {/* ── PERSONAL ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos del personal</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Gestionar la relación laboral.'],
              ['Legitimación', 'Ejecución de un contrato. Cumplimiento de una obligación legal.'],
              ['Destinatarios', 'Están previstas cesiones de datos a: Administración Tributaria, Seguridad Social y Mutua; Bancos y entidades financieras; Fundación estatal para la formación en el empleo (Fundae).'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de realizar la gestión de personal; formación; prevención de riesgos laborales y vigilancia de la salud; elaboración de nóminas, seguros sociales y cotizaciones; registro de jornada; accidentes laborales, en su caso. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Mientras se mantenga la relación laboral con la entidad y durante los años necesarios para cumplir con las obligaciones legales.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-2`}>
              <li>Ejecución de un contrato: Gestión de personal, formación y capacitación. (RGPD art.6.1.b).</li>
              <li>Cumplimiento de una obligación legal: Prevención de riesgos laborales y vigilancia de la salud; elaboración de nóminas, seguros sociales y cotizaciones; registro de jornada; gestión de accidentes laborales, en su caso. (Ley 31/1995; RDL 2/2015; RDL 8/2015; RD-ley 8/2019; RGPD arts. 6.1.c y 9.2.b; RD 902/2020).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>Los datos se comunicarán a los siguientes destinatarios:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Administración Tributaria, Seguridad Social y Mutua, con la finalidad de presentar los impuestos y las obligaciones relativas a seguros sociales (requisito legal).</li>
              <li>Bancos y entidades financieras, con la finalidad de realizar el pago de las nóminas (requisito contractual).</li>
              <li>Fundación estatal para la formación en el empleo (Fundae), con la finalidad de realizar la gestión de la bonificación a la formación de empleados (requisito contractual).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>

        {/* ── EJERCICIO DE DERECHOS ── */}
        <div className="space-y-8">
          <h2 className={heading2}>Tratamiento de los datos para el ejercicio de los derechos de los interesados</h2>

          <section className="space-y-3">
            <h3 className={heading3}>Información básica sobre protección de datos</h3>
            <InfoBasica rows={[
              ['Responsable', 'RED MOUNTAIN LABS, SL'],
              ['Finalidad', 'Gestionar y atender las solicitudes de los interesados en el ejercicio de los derechos establecidos en la normativa de protección de datos.'],
              ['Legitimación', 'Cumplimiento de una obligación legal.'],
              ['Destinatarios', 'Están previstas cesiones de datos a: Autoridades de control, Organismos de la administración pública y Defensor del Pueblo, en su caso.'],
              ['Derechos', 'Tiene derecho a acceder, rectificar y suprimir los datos, así como otros derechos, indicados en la información adicional, que puede ejercer dirigiéndose a hello@mimotic.com.'],
              ['Procedencia', 'El propio interesado'],
            ]} />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>1. ¿Quién es el responsable del tratamiento de sus datos?</h3>
            <ResponsableBlock />
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>2. ¿Con qué finalidad tratamos sus datos personales?</h3>
            <p className={txt}>
              En RED MOUNTAIN LABS, SL tratamos la información que nos facilitan las personas interesadas con el fin de gestionar y atender las solicitudes de los interesados en el ejercicio de los derechos establecidos en la normativa de protección de datos. En el caso de que no facilite sus datos personales, no podremos cumplir con las finalidades descritas.
            </p>
            <p className={txt}>No se van a tomar decisiones automatizadas en base a los datos proporcionados.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>3. ¿Por cuánto tiempo conservaremos sus datos?</h3>
            <p className={txt}>Se conservarán durante el tiempo necesario para resolver las solicitudes y al menos durante tres años para atender posibles reclamaciones.</p>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
            <p className={txt}>Le indicamos la base legal para el tratamiento de sus datos:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Cumplimiento de una obligación legal: gestionar y atender las solicitudes de los interesados en el ejercicio de los derechos establecidos en la normativa de protección de datos (RGPD, art.6.1.b).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>5. ¿A qué destinatarios se comunicarán sus datos?</h3>
            <p className={txt}>Los datos se comunicarán a los siguientes destinatarios:</p>
            <ul className={`${txt} list-disc list-inside space-y-1`}>
              <li>Autoridades de control, Organismos de la administración pública y Defensor del Pueblo, en su caso, con la finalidad de gestionar y atender las solicitudes y las posibles reclamaciones (requisito legal).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className={heading3}>6. Transferencias de datos a terceros países</h3>
            <p className={txt}>No están previstas transferencias de datos a terceros países.</p>
          </section>

          <DerechosSection />

          <section className="space-y-3">
            <h3 className={heading3}>8. ¿Cómo hemos obtenido sus datos?</h3>
            <p className={txt}>Los datos personales que tratamos en RED MOUNTAIN LABS, SL proceden de: El propio interesado.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
