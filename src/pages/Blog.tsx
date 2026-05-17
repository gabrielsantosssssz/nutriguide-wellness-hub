import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import type { BlogArticle } from '../types';

const articles: BlogArticle[] = [
  { id: '1', title: 'Decodificando Gorduras Saudáveis: Lipídios Essenciais para o Cérebro', excerpt: 'Entenda o papel crítico dos ácidos graxos ômega-3 e ômega-6 na saúde cognitiva e integridade celular.', content: 'Os ácidos graxos essenciais são componentes fundamentais da membrana celular neuronal. O DHA (ácido docosa-hexaenoico), um tipo de ômega-3, constitui cerca de 40% dos ácidos graxos poliinsaturados no cérebro. Estudos clínicos demonstram que a suplementação adequada de ômega-3 pode melhorar a função cognitiva, reduzir inflamação sistêmica e apoiar a saúde cardiovascular.\n\nFontes alimentares ricas incluem peixes de água fria (salmão, sardinha), sementes de linhaça, chia e nozes. A proporção ideal entre ômega-6 e ômega-3 deve ser de aproximadamente 4:1, embora a dieta ocidental moderna frequentemente exceda 15:1.\n\nRecomendações educacionais:\n- Incluir 2-3 porções de peixe gordo por semana\n- Diversificar fontes vegetais de ALA\n- Considerar o perfil lipídico completo na avaliação nutricional', category: 'Macronutrientes', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmE1jn_sIMLhyRO3ubsD9s-KjIbwLrBvf_yKF5fW3kNuEWZCqQ85Buj_XGBQXg_RSlDnx9sLL5PF5A0Bvu7SVjsGiTt8fW2Xi3mUKpq7kO5g16AS5LCsMomJMJBeQkhea8qumYeZJHJmmH4I5WLuAI4D1FTCJ6_qH8BinuKV2l9G3FTtLZ3WrwrGioHlqNgZlF6Z9_Jl7mKiQyLUGOTOUs9cG2fMlMAmMGsxxKyhuHw5EXlw2SzxSqAyu_XeC-MA4wIQzZdN5GVQM', imageAlt: 'Abacate e gorduras saudáveis', readTimeMinutes: 6, date: '2026-05-10' },
  { id: '2', title: 'Síntese de Proteínas e Manutenção Muscular no Envelhecimento', excerpt: 'Perfis de aminoácidos, biodisponibilidade e ingestão proteica para prevenir sarcopenia.', content: 'A sarcopenia, perda progressiva de massa e função muscular, afeta aproximadamente 10% dos adultos acima de 50 anos. A ingestão adequada de proteínas de alta qualidade biológica é fundamental para a síntese proteica muscular (SPM).\n\nA leucina, um aminoácido essencial de cadeia ramificada, é o principal ativador da via mTOR, responsável por iniciar a SPM. Fontes como whey protein, ovos e carne bovina são particularmente ricas neste aminoácido.\n\nRecomendações educacionais:\n- 1.2-1.6g de proteína por kg de peso para idosos ativos\n- Distribuir a ingestão proteica ao longo do dia (20-30g por refeição)\n- Combinar treino resistido com nutrição adequada', category: 'Proteínas', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmmBoKBJG18VIn_-0QQR5Iw2KFYBulO8D_4dAP11xZ8cnygjvfOVf_kqkJ01fneUiLeR1Thu0HBI4jxVN5YYj5t4Ro99LasuJIE0tFCbpfYr1uvHCvZqYOIJdQgWEk0yoRtPHmrSHs2eeoKfB81BmbNSj5s6OIw0dpcqrdKpkW_jTBF_vjQpeiFglTEfOQWEHKaNYkxzH08MhIrbq5OWnWppr924gMAmm-MILOodLXOFNiUHPPDQv9uIE9Cl0vYl_w8BeliPYcutQ', imageAlt: 'Salada rica em proteínas', readTimeMinutes: 7, date: '2026-05-08' },
  { id: '3', title: 'O Índice Glicêmico: Navegando em Carboidratos Complexos', excerpt: 'Diferencie carboidratos simples e complexos. Impacto da fibra na estabilização glicêmica.', content: 'O Índice Glicêmico (IG) classifica alimentos com base na velocidade com que elevam a glicemia. Alimentos de baixo IG (≤55) promovem liberação gradual de glicose, enquanto alimentos de alto IG (≥70) causam picos rápidos seguidos de quedas.\n\nA carga glicêmica (CG) considera tanto o IG quanto a quantidade de carboidratos, oferecendo uma medida mais prática. Fibras solúveis retardam a absorção de glicose, contribuindo para melhor controle glicêmico.\n\nExemplos educacionais:\n- Aveia integral: IG 55, rica em beta-glucana\n- Batata-doce: IG 44, fonte de fibras e vitamina A\n- Arroz integral: IG 50, superior ao arroz branco (IG 73)', category: 'Carboidratos', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPfvjeY4itVmqnEKfhoCF2KcX7e3sq--uxw7oOFE0OpjTjZc9v1EzFzfcdIdI-iW7RwyWYnleihcnOHmHqacOSeyD5x_1ey439CAW8CT-t0r6sQGe4OAr3OWDl3nCZvhJEsQuNUbPudceJdFD6g2RC1sUwCsnYG1R6ADJHPakKSRjIyBrej5-xLGeSOFrRT2Vx1B0tfAma4k-IlgGyNj_yyVK6hkLFrDVQ7o1Ai60KA2B-_e9pgv1bO3jUh7PtISkWJ8oEbGZf0Wc', imageAlt: 'Carboidratos complexos', readTimeMinutes: 5, date: '2026-05-05' },
  { id: '4', title: 'Sinergias de Micronutrientes: Como as Vitaminas Trabalham Juntas', excerpt: 'Importância da combinação de nutrientes para maximizar absorção e eficácia bioquímica.', content: 'A biodisponibilidade de micronutrientes depende significativamente de interações sinérgicas. A Vitamina D facilita a absorção intestinal de Cálcio, enquanto a Vitamina C aumenta a absorção de Ferro não-heme em até 6 vezes.\n\nPor outro lado, existem antagonismos: o Cálcio compete com o Ferro pela absorção, e o excesso de Zinco pode reduzir a absorção de Cobre.\n\nCombinações benéficas:\n- Vitamina D + Cálcio: saúde óssea\n- Vitamina C + Ferro: prevenção de anemia\n- Vitamina E + Selênio: proteção antioxidante\n- Vitamina K2 + D3: metabolismo do cálcio', category: 'Micronutrientes', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrcyDV1QmOBfMwqPDoiypNSTIsq0TYLomFwJCbK6ZvJQ3Xw-8qff3SkPlQIxhcpKVIeWJta7URjRffQTVU_KgewJGGctbh4D7xQM56HLZJdaT_LmUW3nQLWJeTeEH2ANGMeXN3gHOAHwz-i9p0hMEVfbr9E5YM7d-GkKa1m2Wnqo_Zt_6hKm54ftunERwDR8LSaV6mr2K3HwTLNEytBYGnAQjOk7-ZWKHcg80_I19JkNUsypE59Itj8hARgnhG67skIG6dkBkPK7c', imageAlt: 'Vitaminas e suplementos', readTimeMinutes: 8, date: '2026-05-02' },
  { id: '5', title: 'Hidratação Celular e Eficiência Metabólica', excerpt: 'Impacto fisiológico da hidratação nas reações enzimáticas e taxa metabólica.', content: 'A água é o meio universal das reações bioquímicas. A desidratação de apenas 2% do peso corporal pode reduzir a capacidade cognitiva em até 20% e a performance física em até 25%.\n\nO balanço hídrico depende da ingestão (líquidos, alimentos e água metabólica) e das perdas (urina, suor, respiração e fezes). A necessidade basal é estimada em 35ml/kg/dia.\n\nSinais educacionais de hidratação adequada:\n- Urina clara a amarelo-palha\n- Pele com boa elasticidade\n- Mucosas úmidas\n- Energia e concentração estáveis', category: 'Metabolismo', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf14mz7Vg31EPQVS2a_XK35Q62OxZ6UEwT3GS2ljNB5sAJW-6AFuDlQ9cr04eETxoaS9VrOo7lE7EWMK5jI597E0IBbDFeBf2uncBhJnOjsPKCtuaO06s33X3sp12rxILWiwgne3jZgo4UTkMt3XLmTDjl1VFXm0b9mBWv9hiAN7SPDFL51O-aQ-_kQEeGPwYcGV1AUPpAhqvTL01vETB-arwhb0l06Ogwos6qHI323cRfQbq5FXJ0oWsn703w_o3hMJKBuXLh2fs', imageAlt: 'Hidratação e metabolismo', readTimeMinutes: 5, date: '2026-04-28' },
];

const categories = ['Todos', ...new Set(articles.map(a => a.category))];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'Todos' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">Educação Nutricional</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Insights baseados em evidências sobre macronutrientes, saúde metabólica e ciência nutricional.</p>
        </div>
        {/* Search & Filters */}
        <div className="mb-8 space-y-4 animate-slide-up stagger-1">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><span className="material-symbols-outlined text-[20px]">search</span></span>
            <input className="w-full bg-surface-bright border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Buscar artigos..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-all ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{cat}</button>
            ))}
          </div>
        </div>
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <article key={article.id} className={`bg-surface rounded-xl border border-outline-variant overflow-hidden flex flex-col group hover:shadow-[0_4px_24px_rgba(13,99,27,0.08)] transition-all duration-300 cursor-pointer animate-slide-up stagger-${Math.min(i + 1, 6)}`} onClick={() => setSelectedArticle(article)}>
              <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                <img alt={article.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl} />
                <div className="absolute top-3 left-3"><Badge color={article.category === 'Micronutrientes' ? 'secondary' : article.category === 'Metabolismo' ? 'neutral' : 'primary'}>{article.category}</Badge></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg text-primary flex items-center gap-1">Ler Artigo <span className="material-symbols-outlined text-[18px]">arrow_forward</span></span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span>{article.readTimeMinutes} min</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-on-surface-variant text-[48px] mb-4 block">search_off</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Nenhum artigo encontrado.</p>
          </div>
        )}
      </main>
      <Footer />
      {/* Article Modal */}
      <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={selectedArticle?.title || ''} size="lg">
        {selectedArticle && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge color="primary">{selectedArticle.category}</Badge>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span>{selectedArticle.readTimeMinutes} min de leitura</span>
            </div>
            <img alt={selectedArticle.imageAlt} className="w-full h-64 object-cover rounded-xl mb-6" src={selectedArticle.imageUrl} />
            <div className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">{selectedArticle.content}</div>
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">info</span>Este conteúdo é apenas educacional e não substitui orientação profissional.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
