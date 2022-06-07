<template>
  <section class="campaign">
    <main class="main  animated fadeIn faster" :class="{ 'expand-main' : isMenuCollapse }">
      <LoadingSpinner v-if="loading" />
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">{{ $t('lang.menu.faq') }}</li>
      </ol>
    <div class="contenedor animated fadeIn faster">
        <div class="styles-steps pb-4">
            <div class="row ">
              <div class="col-12 mx-auto">
                  <div class="accordion" id="faqExample">
                      <div class="card">
                          <div class="card-header p-2" id="headingOne">
                              <h5 class="mb-0">
                                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    Q. Qu'est-ce qu'une campagne ?
                                  </button>
                                </h5>
                          </div>

                          <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#faqExample">
                              <div class="card-body">
                                    
                                    <p><br></p>
                                    <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le r&eacute;sultat de la campagne est pr&eacute;sent&eacute; sous la forme d&rsquo;une liste de prospects montrant de l&#39;int&eacute;r&ecirc;t pour vos produits. Vous pouvez consulter cette liste dans la section &ldquo;opportunit&eacute;s&rdquo;.</span></p>
                                    <p><br></p>
                                    <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une campagne est d&eacute;finie par les &eacute;l&eacute;ments suivants :&nbsp;</span></p>
                                    <ul style="margin-top:0;margin-bottom:0;">
                                        <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                            <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Votre audience</span></p>
                                        </li>
                                        <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                            <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Votre message</span></p>
                                        </li>
                                        <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                            <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Un budget journalier</span></p>
                                        </li>
                                    </ul>
                                    <p><br></p>
                                    <p dir="ltr" style="line-height:1.38;text-align: justify;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une campagne pr&eacute;sente un produit ou une offre sp&eacute;cifique. Il est possible de lancer plusieurs campagnes simultan&eacute;ment sur Oliver. Pour lancer une nouvelle campagne, rendez-vous dans la section &ldquo;Campagnes&rdquo;.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingTwo">
                              <h5 class="mb-0">
                              <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Q. Qu'est ce qu'une activité ?
                              </button>
                            </h5>
                          </div>
                          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Chaque campagne de prospection inclut un lien personnalis&eacute; pr&eacute;sentant une offre, un produit ou un service. Ce lien personnalis&eacute; redirige le prospect vers une page web. Gr&acirc;ce &agrave; ce lien, Oliver traque les prospects visitant la page web.</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une activit&eacute; correspond &agrave; un clic sur le lien pr&eacute;sent dans les campagnes Oliver, suivi d&rsquo;une navigation sur la page web.</span></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br></span><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le prix des activit&eacute;s varie en fonction de la taille de l&rsquo;entreprise contact&eacute;e. Plus le nombre d&rsquo;employ&eacute;s dans une entreprise est grand, plus le prix des activit&eacute;s sera &eacute;lev&eacute;.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Chaque activit&eacute; est factur&eacute;e individuellement.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingThree">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Q. Qu'est-ce qu'un engagement ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Lorsqu&rsquo;un prospect engage une conversation avec vous par mail &agrave; la suite d&rsquo;une campagne de prospection, Oliver consid&egrave;re que ce prospect montre de l&#39;int&eacute;r&ecirc;t pour vos produits. C&rsquo;est ce que l&rsquo;on appelle l&rsquo;engagement. &nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Oliver analyse l&rsquo;ensemble des r&eacute;ponses de vos prospects, positives et n&eacute;gatives. Il r&eacute;pond automatiquement aux r&eacute;ponses n&eacute;gatives et vous transmet les autres sous la forme d&rsquo;engagement.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Chaque engagement est factur&eacute; individuellement.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingFour">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="false" aria-controls="collapsefour">
                                    Q. Qu'est-ce qu'une opportunité ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapsefour" class="collapse" aria-labelledby="hea
                          dingFour" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une opportunit&eacute; correspond la fiche d&rsquo;une entreprise au sein de laquelle un ou plusieurs prospects montrent de l&#39;int&eacute;r&ecirc;t pour vos offres.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une opportunit&eacute; est cr&eacute;&eacute;e lorsqu&rsquo;un prospect r&eacute;alise une activit&eacute; sur le lien transmis ou engage une conversation avec vous par mail.&nbsp;</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingFour">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="false" aria-controls="collapsefour">
                                    Q. Quels est le prix d’une opportunité ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapsefour" class="collapse" aria-labelledby="headingfour" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le prix d&rsquo;une opportunit&eacute; d&eacute;pend du nombre d&rsquo;activit&eacute;s et d&rsquo;engagements li&eacute;s &agrave; cette derni&egrave;re.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Une opportunit&eacute; peut inclure plusieurs activit&eacute;s et plusieurs engagements.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingFive">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    Q. Quels moyens de paiement acceptez-vous ? 
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Pour utiliser l&rsquo;application Oliver, vous devez ajouter une carte bancaire &agrave; vos m&eacute;thodes de paiement dans la section &ldquo;Facturation&rdquo;.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingSix">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                    Q. Comment le score d'intérêt fonctionne t’il ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseSix" class="collapse" aria-labelledby="headingSix" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Oliver attribue automatiquement un score &agrave; chacune des opportunit&eacute;s. Le score &eacute;value le niveau d&#39;int&eacute;r&ecirc;t des prospects pr&eacute;sents dans une opportunit&eacute;.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le calcul du score est effectu&eacute; automatiquement par Oliver et est bas&eacute; sur les crit&egrave;res suivants :&nbsp;</span></p>
                                  <ul style="margin-top:0;margin-bottom:0;">
                                      <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le nombre d&rsquo;ouvertures du lien dans vos campagnes</span></p>
                                      </li>
                                      <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le temps pass&eacute; et les interactions r&eacute;alis&eacute;es sur le lien pr&eacute;sent&eacute; dans vos campagnes</span></p>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingSeven">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                    Q. Quelle est notre politique de remboursement ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseSeven" class="collapse" aria-labelledby="headingSeven" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dans le cas d&#39;une r&eacute;clamation veuillez nous transmettre un email avec l&#39;objet de la r&eacute;clamation, votre nom d&#39;utilisateur et la campagne concern&eacute;e &agrave; l&rsquo;adresse suivante :&nbsp;</span></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><a href="mailto:support@oliverlist.com" style="text-decoration:none;"><span style="font-size:11pt;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">support@oliverlist.com</span></a></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingHeight">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseHeight" aria-expanded="false" aria-controls="collapseHeight">
                                    Q. Comment assurez-vous la protection de mes informations personnelles ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseHeight" class="collapse" aria-labelledby="headingHeight" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">La protection et le respect de vos informations personnelles sont une priorit&eacute; pour l&rsquo;ensemble de notre &eacute;quipe.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ainsi, nous garantissons une s&eacute;curit&eacute; maximale de vos donn&eacute;es personnelles en stockant ces derni&egrave;res dans des serveurs Amazon Premium. Ces donn&eacute;es sont anonymis&eacute;es et ne seront jamais transmises &agrave; un parti tiers.</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Les informations de paiement que vous renseignez sur notre service ne nous sont jamais communiqu&eacute;s. Ces derni&egrave;res transitent par Ingenico, le service de r&eacute;f&eacute;rence des paiements en ligne s&eacute;curis&eacute;s. Une fois votre m&eacute;thode de paiement renseign&eacute;e, cette derni&egrave;re est enregistr&eacute;e et s&eacute;curis&eacute;e par Ingenico.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingNine">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
                                    Q. Qu’est-ce que le code de suivi ? 
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseNine" class="collapse" aria-labelledby="headingNine" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Un code de suivi est un petit morceau de code qui est habituellement impl&eacute;ment&eacute; comme JavaScript dans le code source d&#39;un site Web.</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ces lignes de code nous permettent d&#39;analyser le flux de visiteurs sur votre site Web et les activit&eacute;s des utilisateurs arrivant via vos campagnes. Nous vous demandons donc d&rsquo;int&eacute;grer le code de suivi dans les sites web utilis&eacute;s comme pages de destination pour vos campagnes.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingTen">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
                                    Q. Qu’est-ce que le code de suivi ? 
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseTen" class="collapse" aria-labelledby="headingTen" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Un code de suivi est un petit morceau de code qui est habituellement impl&eacute;ment&eacute; comme JavaScript dans le code source d&#39;un site Web.</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ces lignes de code nous permettent d&#39;analyser le flux de visiteurs sur votre site Web et les activit&eacute;s des utilisateurs arrivant via vos campagnes. Nous vous demandons donc d&rsquo;int&eacute;grer le code de suivi dans les sites web utilis&eacute;s comme pages de destination pour vos campagnes.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingEleven">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseEleven" aria-expanded="false" aria-controls="collapseEleven">
                                    Q. Comment Oliver récupère t-il des informations de contact ?

                                  </button>
                                </h5>
                          </div>
                          <div id="collapseEleven" class="collapse" aria-labelledby="headingEleven" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Nous collectons des donn&eacute;es de mani&egrave;re indirecte, sur des bases de donn&eacute;es publiques disponibles en ligne, en particulier les r&eacute;seaux sociaux professionnels. La pertinence de ces donn&eacute;es est ensuite v&eacute;rifi&eacute;e aupr&egrave;s des entreprises afin d&rsquo;attester de la conformit&eacute; de ces derni&egrave;res.</span></p>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingTwelve">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwelve" aria-expanded="false" aria-controls="collapseTwelve">
                                    Q. Comment fonctionne la facturation ?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseTwelve" class="collapse" aria-labelledby="headingTwelve" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Si vous utilisez le paiement automatique, vos frais publicitaires vous seront factur&eacute;s 30 jours apr&egrave;s le dernier d&eacute;bit automatique ou d&egrave;s que votre compte aura atteint un montant pr&eacute;d&eacute;termin&eacute;, appel&eacute; seuil de paiement, selon la premi&egrave;re &eacute;ch&eacute;ance atteinte.</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Seuil de paiement : Il s&#39;agit du montant des co&ucirc;ts &agrave; partir duquel la facturation est d&eacute;clench&eacute;e. Il commence &agrave; un niveau de d&eacute;part que vous pouvez consulter sur la page R&eacute;capitulatif de facturation de votre compte. Il augmente automatiquement si vos co&ucirc;ts atteignent ce seuil avant la fin du cycle de facturation de 30 jours.</span></p>
                                  <ul style="margin-top:0;margin-bottom:0;">
                                      <li dir="ltr" style="list-style-type:disc;font-size:10.5pt;font-family:Roboto,sans-serif;color:#3c4043;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:3pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Si les co&ucirc;ts associ&eacute;s &agrave; votre compte atteignent le seuil avant les 30 jours, votre seuil est revu &agrave; la hausse. Cela peut se produire &agrave; plusieurs reprises jusqu&#39;&agrave; ce que votre compte atteigne un seuil final.&nbsp;</span></p>
                                      </li>
                                      <li dir="ltr" style="list-style-type:disc;font-size:10.5pt;font-family:Roboto,sans-serif;color:#3c4043;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le montant qui vous est factur&eacute; peut-&ecirc;tre l&eacute;g&egrave;rement sup&eacute;rieur au seuil de facturation si votre compte g&eacute;n&egrave;re des co&ucirc;ts tr&egrave;s rapidement. Il se peut que vous receviez plusieurs factures par mois si votre compte atteint son seuil de facturation plusieurs fois au cours du mois.</span></p>
                                      </li>
                                      <li dir="ltr" style="list-style-type:disc;font-size:10.5pt;font-family:Roboto,sans-serif;color:#3c4043;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:9pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Si votre seuil de paiement augmente, vous ne recevrez pas d&#39;e-mail ni de notification. Vous pouvez toutefois le consulter sur votre page R&eacute;capitulatif de facturation. Pour conna&icirc;tre votre seuil, acc&eacute;dez &agrave; la section &ldquo;Param&egrave;tres&rdquo;, puis s&eacute;lectionnez Facturation et paiements. Vous acc&eacute;derez &agrave; la page &quot;R&eacute;capitulatif&quot;, qui pr&eacute;sente le montant cumul&eacute; de vos frais publicitaires depuis votre dernier paiement. Consultez le montant de votre seuil sous la barre de progression.</span></p>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-header p-2" id="headingThirteen">
                              <h5 class="mb-0">
                                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThirteen" aria-expanded="false" aria-controls="collapseThirteen">
                                    Q. Suis-je conforme au RGPD en utilisant Oliver?
                                  </button>
                                </h5>
                          </div>
                          <div id="collapseThirteen" class="collapse" aria-labelledby="headingThirteen" data-parent="#faqExample">
                              <div class="card-body">
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Le R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es entre en application le 25 mai 2018. Oliver, en tant que producteur de data, est directement concern&eacute;.&nbsp;</span></p>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">L&rsquo;ensemble des processus d&rsquo;acquisition et de contact utilis&eacute;s par Oliver sont en conformit&eacute; avec la RGPD.&nbsp;</span></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br></span><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ainsi, Oliver respect les obligations l&eacute;gales suivantes :&nbsp;</span></p>
                                  <ul style="margin-top:0;margin-bottom:0;">
                                      <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Nous informons nos prospects sur les conditions de traitement des donn&eacute;es,</span></p>
                                      </li>
                                      <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Nous respectons le droit d&rsquo;opposition ( lien de d&eacute;sinscription)</span></p>
                                      </li>
                                      <li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;">
                                          <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Et nous nous assurons que la sollicitation soit en rapport avec la profession de la personne d&eacute;march&eacute;e.</span></p>
                                      </li>
                                  </ul>
                                  <p><br></p>
                                  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">En tant qu&rsquo;utilisateurs, vous &ecirc;tes donc parfaitement en droit d&rsquo;utiliser Oliver, tout en &eacute;tant conforme au RGPD.</span></p>
                              </div>
                          </div>
                      </div>

                  
              </div>
            </div>
          </div>
        </div>
    </div>
      
  </main>
</section>
</template>
<script>
import { mapState, mapActions } from "vuex";


export default {
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },

  components: {
    
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
       isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    // campaignsTabComponent() {
    //   if (this.headerTab === "ALL") {
    //     return "AllCampaigns";
    //   }
    //   return "CampaignDetail";
    // },

    // selectedCampaignId() {
    //   return this.$route.params.id;
    // }
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    })
  }
};
</script>