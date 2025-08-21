import Head from "next/head"

export default function PoliticaPrivacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade - CapShop</title>
        <meta name="description" content="Política de privacidade da CapShop" />
      </Head>

      <main className="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

        <p className="mb-4">
          A sua privacidade é importante para nós. É política da <strong>CapShop</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar em nosso site e serviços.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Informações que Coletamos</h2>
        <p className="mb-4">
          Podemos solicitar informações pessoais como nome, e-mail, telefone e dados de pagamento quando necessário para fornecer nossos serviços.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Uso das Informações</h2>
        <p className="mb-4">
          Utilizamos os dados coletados para melhorar sua experiência, processar pedidos, enviar notificações e oferecer suporte.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Compartilhamento de Dados</h2>
        <p className="mb-4">
          Não compartilhamos informações de identificação pessoal com terceiros, exceto quando exigido por lei ou para prestação de serviços contratados (ex.: processamento de pagamentos).
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Segurança</h2>
        <p className="mb-4">
          Tomamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Alterações</h2>
        <p className="mb-4">
          Esta política pode ser atualizada periodicamente. Recomendamos que revise esta página para estar sempre ciente de nossas práticas.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Contato</h2>
        <p className="mb-4">
          Se tiver dúvidas sobre esta política, entre em contato pelo e-mail:{" "}
          <a href="mailto:suporte@capshop.com" className="text-blue-600 underline">
            suporte@capshop.com
          </a>.
        </p>
      </main>
    </>
  )
}
