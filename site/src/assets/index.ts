// Typed asset map. Names mirror the handoff bundle's asset map (portfolio / team / process / …).
import coverPodcastStudio from './images/backgrounds/cover-podcast-studio.webp';
import coverPodcastStudioSm from './images/backgrounds/cover-podcast-studio-720.webp';

import backstageBoardroomSlider from './images/process/backstage-boardroom-slider.webp';
import backstageBoardroomSliderSm from './images/process/backstage-boardroom-slider-720.webp';
import backstageFactoryBoom from './images/process/backstage-factory-boom.webp';
import backstageFactoryBoomSm from './images/process/backstage-factory-boom-720.webp';
import backstageFactoryJib from './images/process/backstage-factory-jib.webp';
import backstageFactoryJibSm from './images/process/backstage-factory-jib-720.webp';
import backstageLoftInterview from './images/process/backstage-loft-interview.webp';
import backstageLoftInterviewSm from './images/process/backstage-loft-interview-720.webp';
import backstagePodcastStudio from './images/process/backstage-podcast-studio.webp';
import backstagePodcastStudioSm from './images/process/backstage-podcast-studio-720.webp';
import backstageStudioCrane from './images/process/backstage-studio-crane.webp';
import backstageStudioCraneSm from './images/process/backstage-studio-crane-720.webp';
import backstageStudioSet from './images/process/backstage-studio-set.webp';
import backstageStudioSetSm from './images/process/backstage-studio-set-720.webp';

import p456239162 from './images/portfolio/456239162.webp';
import p456239356 from './images/portfolio/456239356.webp';
import p456239359 from './images/portfolio/456239359.webp';
import p456239459 from './images/portfolio/456239459.webp';
import p456239518 from './images/portfolio/456239518.webp';
import p456239538 from './images/portfolio/456239538.webp';
import p456239539 from './images/portfolio/456239539.webp';
import p456239545 from './images/portfolio/456239545.webp';
// archive stills — VK videos of the studio that were in the export but not in the confirmed list
import p456239159 from './images/portfolio/456239159.webp';
import p456239161 from './images/portfolio/456239161.webp';
import p456239353 from './images/portfolio/456239353.webp';
import p456239354 from './images/portfolio/456239354.webp';
import p456239369 from './images/portfolio/456239369.webp';
import p456239388 from './images/portfolio/456239388.webp';
import p456239447 from './images/portfolio/456239447.webp';
import p456239519 from './images/portfolio/456239519.webp';
import p456239521 from './images/portfolio/456239521.webp';

import teamAlekseyDrone from './images/team/team-aleksey-drone.webp';
import teamAnisaMakeup from './images/team/team-anisa-makeup.webp';
import teamBulatLight from './images/team/team-bulat-light.webp';
import teamIrinaEditor from './images/team/team-irina-editor.webp';
import teamIskhakSound from './images/team/team-iskhak-sound.webp';
import teamNikolayCamera from './images/team/team-nikolay-camera.webp';
import teamRomanDirector from './images/team/team-roman-director.webp';
import teamSemenDop from './images/team/team-semen-dop.webp';

import clientAvito from './images/clients/avito.png';
import clientAvtodor from './images/clients/avtodor.png';
import clientIcl from './images/clients/icl-services.png';
import clientLeroy from './images/clients/leroy-merlin.png';
import clientMega from './images/clients/mega.png';
import clientSibur from './images/clients/sibur.png';
import clientUnistroy from './images/clients/unistroy.png';
import clientVk from './images/clients/vk.png';
import clientYandexEda from './images/clients/yandex-eda.png';

import logo from './images/logo.svg';

/** A photo with a phone-size variant for `srcSet`. */
export interface Photo {
  src: string;
  small: string;
  width: number;
}

const photo = (src: string, small: string, width = 1160): Photo => ({ src, small, width });

export const backgrounds = {
  coverPodcastStudio: photo(coverPodcastStudio, coverPodcastStudioSm),
};

export const process = {
  boardroomSlider: photo(backstageBoardroomSlider, backstageBoardroomSliderSm),
  factoryBoom: photo(backstageFactoryBoom, backstageFactoryBoomSm),
  factoryJib: photo(backstageFactoryJib, backstageFactoryJibSm),
  loftInterview: photo(backstageLoftInterview, backstageLoftInterviewSm),
  podcastStudio: photo(backstagePodcastStudio, backstagePodcastStudioSm),
  studioCrane: photo(backstageStudioCrane, backstageStudioCraneSm),
  studioSet: photo(backstageStudioSet, backstageStudioSetSm),
};

/** Portfolio posters keyed by VK video id. */
export const posters: Record<string, string> = {
  '456239162': p456239162,
  '456239356': p456239356,
  '456239359': p456239359,
  '456239459': p456239459,
  '456239518': p456239518,
  '456239538': p456239538,
  '456239539': p456239539,
  '456239545': p456239545,
  '456239159': p456239159,
  '456239161': p456239161,
  '456239353': p456239353,
  '456239354': p456239354,
  '456239369': p456239369,
  '456239388': p456239388,
  '456239447': p456239447,
  '456239519': p456239519,
  '456239521': p456239521,
};

export const team = {
  aleksey: teamAlekseyDrone,
  anisa: teamAnisaMakeup,
  bulat: teamBulatLight,
  irina: teamIrinaEditor,
  iskhak: teamIskhakSound,
  nikolay: teamNikolayCamera,
  roman: teamRomanDirector,
  semen: teamSemenDop,
};

export const clients = {
  icl: clientIcl,
  leroy: clientLeroy,
  avito: clientAvito,
  unistroy: clientUnistroy,
  avtodor: clientAvtodor,
  vk: clientVk,
  yandexEda: clientYandexEda,
  mega: clientMega,
  sibur: clientSibur,
};

export { logo };
