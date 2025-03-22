import { Header } from "@/components/header";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-24">
        <h1 className="text-3xl font-bold mb-6 text-carbonBlack">Política de Privacidade</h1>
        <p className="text-sm text-leadGray mb-6">Última atualização: 21/03/2025</p>

        <div className="space-y-6">
          <p className="text-leadGray">
            A Daniel Filgueira Imobiliária valoriza a privacidade e a segurança das informações de seus clientes e visitantes. Este documento tem como objetivo esclarecer como coletamos, usamos, armazenamos e protegemos seus dados ao acessar nosso site danielfilgueira.com.br e utilizar nossos serviços.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">1. Informações Coletadas</h2>
            <p className="text-leadGray mb-2">Ao interagir com nossa plataforma, podemos coletar as seguintes informações:</p>
            <ul className="list-disc pl-6 text-leadGray space-y-2">
              <li>Dados pessoais: Nome, telefone, e-mail e demais informações fornecidas ao preencher formulários de contato ou realizar cadastros.</li>
              <li>Dados de navegação: Endereço IP, tipo de navegador, páginas visitadas e tempo de permanência em nosso site.</li>
              <li>Cookies e tecnologias similares: Para melhorar a experiência do usuário, utilizamos cookies que armazenam preferências e interações no site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">2. Uso das Informações</h2>
            <p className="text-leadGray mb-2">As informações coletadas são utilizadas para:</p>
            <ul className="list-disc pl-6 text-leadGray space-y-2">
              <li>Fornecer atendimento personalizado e responder dúvidas ou solicitações;</li>
              <li>Enviar informações sobre imóveis, serviços e novidades da Daniel Filgueira Imobiliária;</li>
              <li>Melhorar a experiência de navegação e otimizar nossos serviços;</li>
              <li>Garantir a segurança do site e cumprir obrigações legais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">3. Compartilhamento de Dados</h2>
            <p className="text-leadGray">
              Os dados dos usuários não são vendidos ou compartilhados com terceiros, exceto nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-leadGray space-y-2 mt-2">
              <li>Para cumprimento de obrigações legais ou solicitações de autoridades competentes;</li>
              <li>Com parceiros e fornecedores essenciais para a prestação de nossos serviços, sempre garantindo sigilo e proteção das informações.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">4. Proteção e Armazenamento dos Dados</h2>
            <p className="text-leadGray">
              Adotamos medidas de segurança para proteger suas informações contra acessos não autorizados, alterações, divulgações ou destruições indevidas. No entanto, é importante estar ciente de que nenhum sistema é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">5. Direitos dos Usuários</h2>
            <p className="text-leadGray mb-2">Você pode, a qualquer momento:</p>
            <ul className="list-disc pl-6 text-leadGray space-y-2">
              <li>Solicitar acesso, correção ou exclusão dos seus dados pessoais;</li>
              <li>Optar por não receber comunicações de marketing;</li>
              <li>Gerenciar preferências de cookies através das configurações do navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">6. Contato</h2>
            <p className="text-leadGray">
              Para dúvidas ou solicitações relacionadas à privacidade dos seus dados, entre em contato pelo e-mail{' '}
              <a href="mailto:danielfilgueiracorretor@gmail.com" className="text-blue-600 hover:underline">
                danielfilgueiracorretor@gmail.com
              </a>{' '}
              ou pelo WhatsApp{' '}
              <a href="https://wa.me/558496703029" target="_blank" className="text-blue-600 hover:underline">
                +55 84 9670-3029
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-carbonBlack">7. Alterações na Política de Privacidade</h2>
            <p className="text-leadGray">
              Esta política pode ser atualizada periodicamente para refletir mudanças legais ou melhorias em nossos serviços. Recomendamos que os usuários revisem este documento regularmente.
            </p>
          </section>

          <div className="mt-8 pt-4 border-t">
            <p className="text-leadGray">
              Daniel Filgueira Imobiliária{' '}
              <a href="https://www.danielfilgueira.com.br" className="text-blue-600 hover:underline">
                www.danielfilgueira.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
