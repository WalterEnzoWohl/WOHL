import svgPaths from "./svg-tbnn9pp62y";
import imgUserProfile from "figma:asset/fb028a71da951efc97f6aa626d98193e96551913.png";
import imgExercisePreview from "figma:asset/99c3a329ffa8bf0443b637285912b75ffdf70300.png";
import imgExercisePreview1 from "figma:asset/dbdbe454fbeadd9af02bb966bb758e607ab426d8.png";

function Margin() {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]" data-name="Margin">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 22">
        <g id="Margin">
          <path d={svgPaths.p1820480} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] tracking-[1px] uppercase w-[38.31px]">
          <p className="leading-[15px]">Inicio</p>
        </div>
      </div>
    </div>
  );
}

function LinkInicioActive() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] relative rounded-[12px] shrink-0" data-name="Link - Inicio (Active)">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_15px_0px_rgba(18,239,211,0.2)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[9px] relative">
        <Margin />
        <Container />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[23.8px] relative shrink-0 w-[19.8px]" data-name="Margin">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.8 23.8">
        <g id="Margin">
          <path d={svgPaths.p2246b680} fill="var(--fill-0, #A1A1A1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[105.33px]">
        <p className="leading-[15px]">Entrenamientos</p>
      </div>
    </div>
  );
}

function LinkEntrenamientos() {
  return (
    <div className="relative shrink-0" data-name="Link - Entrenamientos">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Margin1 />
        <Container1 />
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Margin">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Margin">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #A1A1A1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[39.13px]">
        <p className="leading-[15px]">Perfil</p>
      </div>
    </div>
  );
}

function LinkPerfil() {
  return (
    <div className="relative shrink-0" data-name="Link - Perfil">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Margin2 />
        <Container2 />
      </div>
    </div>
  );
}

function BottomNavBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(14,14,14,0.8)] bottom-0 content-stretch flex gap-[9.7px] h-[96px] items-center left-0 pb-[24px] pl-[20.86px] pr-[20.9px] pt-px w-[390px] z-[3]" data-name="BottomNavBar">
      <div aria-hidden="true" className="absolute border-[#262626] border-solid border-t inset-0 pointer-events-none" />
      <div className="absolute bg-[rgba(255,255,255,0)] bottom-0 h-[96px] left-0 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-[390px]" data-name="BottomNavBar:shadow" />
      <LinkInicioActive />
      <LinkEntrenamientos />
      <LinkPerfil />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2bce57c0} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container4 />
    </div>
  );
}

function GymUpLogo() {
  return <div className="shrink-0 size-[32px]" data-name="GymUp Logo" />;
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold_Italic',sans-serif] font-extrabold h-[28px] italic justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[20px] tracking-[-1px] uppercase w-[69.53px]">
        <p className="leading-[28px]">GYMUP</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <GymUpLogo />
      <Heading />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button />
        <Container5 />
      </div>
    </div>
  );
}

function UserProfile() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="User Profile">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUserProfile} />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#262626] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background+Border+Shadow">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <UserProfile />
      </div>
      <div aria-hidden="true" className="absolute border border-[#262626] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_1px_rgba(18,239,211,0.2)]" />
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="bg-[#0e0e0e] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header - TopAppBar">
      <div aria-hidden="true" className="absolute border-[#262626] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
          <Container3 />
          <BackgroundBorderShadow />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[30px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Container">
          <path d={svgPaths.p1ebca240} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[24px] text-center text-white tracking-[-0.6px] w-[235.02px]">
          <p className="leading-[32px]">Iniciar Entrenamiento</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[10px] text-center tracking-[1px] uppercase w-[160.02px]">
          <p className="leading-[15px]">Sesión actual: Empuje A</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[17px] py-[5px] relative">
        <Container8 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="Button" style={{ backgroundImage: "linear-gradient(152.636deg, rgb(27, 59, 56) 0%, rgb(28, 28, 28) 100%)" }}>
      <div className="content-stretch flex flex-col gap-[12px] items-center justify-center overflow-clip px-px py-[33px] relative rounded-[inherit] w-full">
        <Container6 />
        <Container7 />
        <OverlayBorder />
        <div className="absolute h-[80px] right-[33px] top-[25px] w-[64px]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 80">
            <path d={svgPaths.p2c20fa80} fill="var(--fill-0, white)" id="Icon" opacity="0.05" />
          </svg>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function HeroSectionIniciarEntrenamiento() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Hero Section: Iniciar Entrenamiento">
      <div className="absolute bg-gradient-to-r blur-[4px] from-[#12efd3] inset-[-4px] opacity-20 rounded-[12px] to-[#0dbda7]" data-name="Gradient+Blur" />
      <Button1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-baseline justify-between leading-[0] relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center relative shrink-0 text-[20px] text-white tracking-[-0.5px] w-[218.23px]">
        <p className="leading-[28px]">Próximo entrenamiento</p>
      </div>
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center not-italic relative shrink-0 text-[#12efd3] text-[12px] tracking-[1.2px] uppercase w-[62.69px]">
        <p className="leading-[16px]">Mañana</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[24px] text-white w-[206.95px]">
        <p className="leading-[32px]">{`Tracción & Bíceps`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p29478120} fill="var(--fill-0, #A1A1A1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[14px] w-[135.78px]">
        <p className="leading-[20px]">65 min • 7 ejercicios</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[3.5px] items-start relative shrink-0 w-[206.95px]" data-name="Container">
      <Heading2 />
      <Container11 />
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="relative shrink-0 size-[45.8px]" data-name="Overlay+Border">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45.8 45.8">
        <g id="Overlay+Border">
          <rect fill="var(--fill-0, #12EFD3)" fillOpacity="0.1" height="45.8" rx="8" width="45.8" />
          <rect height="44.8" rx="7.5" stroke="var(--stroke-0, #12EFD3)" strokeOpacity="0.2" width="44.8" x="0.5" y="0.5" />
          <path d={svgPaths.p29b531d0} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative w-full">
        <Container10 />
        <OverlayBorder1 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[14px] w-[52.2px]">
        <p className="leading-[20px]">Espalda</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-gradient-to-r flex-[1_0_0] from-[#12efd3] min-h-px min-w-px relative to-[#0dbda7] w-[102.39px]" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0.5)] bottom-0 right-0 top-0 w-[4px]" data-name="Overlay" />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col h-[6px] items-start justify-center overflow-clip relative rounded-[9999px] shrink-0 w-[128px]" data-name="Background">
      <Background1 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Background />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[14px] w-[44.69px]">
        <p className="leading-[20px]">Bíceps</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-gradient-to-r flex-[1_0_0] from-[#12efd3] min-h-px min-w-px relative to-[#0dbda7] w-[51.19px]" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0.5)] bottom-0 right-0 top-0 w-[4px]" data-name="Overlay" />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col h-[6px] items-start justify-center overflow-clip relative rounded-[9999px] shrink-0 w-[128px]" data-name="Background">
      <Background3 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Background2 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative w-full">
        <Container14 />
        <Container16 />
      </div>
    </div>
  );
}

function ExercisePreview() {
  return (
    <div className="max-w-[300px] mr-[-12px] pointer-events-none relative rounded-[8px] shrink-0 size-[40px]" data-name="Exercise preview">
      <div className="absolute inset-0 overflow-hidden rounded-[8px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgExercisePreview} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#111] border-solid inset-0 rounded-[8px]" />
    </div>
  );
}

function ExercisePreview1() {
  return (
    <div className="max-w-[300px] pointer-events-none relative rounded-[8px] shrink-0 size-[40px]" data-name="Exercise preview">
      <div className="absolute inset-0 overflow-hidden rounded-[8px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgExercisePreview1} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#111] border-solid inset-0 rounded-[8px]" />
    </div>
  );
}

function ImgExercisePreviewMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[288px] mr-[-12px] relative shrink-0 size-[40px]" data-name="Img - Exercise preview:margin">
      <ExercisePreview1 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#262626] content-stretch flex items-center justify-center pb-[13px] pt-[12px] px-[2px] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#111] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] text-center w-[12.86px]">
        <p className="leading-[15px]">+5</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-12px] relative shrink-0 size-[40px]" data-name="Margin">
      <BackgroundBorder1 />
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pr-[12px] relative w-full">
        <ExercisePreview />
        <ImgExercisePreviewMargin />
        <Margin3 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#111] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[21px] relative w-full">
          <Container9 />
          <Container13 />
          <Container18 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#262626] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Section1ProximoEntrenamiento() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section 1: Próximo entrenamiento">
      <Paragraph />
      <BackgroundBorder />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[20px] text-white tracking-[-0.5px] w-full">
        <p className="leading-[28px]">Resumen Semanal</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[6.66px]">
        <p className="leading-[15px]">L</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[7.963px] relative shrink-0 w-[10.442px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.4417 7.9625">
        <g id="Container">
          <path d={svgPaths.p90c9340} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container21 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container20 />
        <OverlayBorder2 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[10.23px]">
        <p className="leading-[15px]">M</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[7.963px] relative shrink-0 w-[10.442px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.4417 7.9625">
        <g id="Container">
          <path d={svgPaths.p90c9340} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container24 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container23 />
        <OverlayBorder3 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[10px] tracking-[1px] uppercase w-[8.2px]">
        <p className="leading-[15px]">X</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p1c414480} fill="var(--fill-0, #0E0E0E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#12efd3] content-stretch flex items-center justify-center relative rounded-[9999px] shadow-[0px_0px_15px_0px_rgba(18,239,211,0.2)] shrink-0 size-[40px]" data-name="Background+Shadow">
      <Container27 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container26 />
        <BackgroundShadow />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[6.8px]">
        <p className="leading-[15px]">J</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container29 />
        <div className="bg-[#262626] rounded-[9999px] shrink-0 size-[40px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[8.28px]">
        <p className="leading-[15px]">V</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container31 />
        <div className="bg-[#262626] rounded-[9999px] shrink-0 size-[40px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[7.52px]">
        <p className="leading-[15px]">S</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container33 />
        <div className="bg-[#262626] rounded-[9999px] shrink-0 size-[40px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[8.23px]">
        <p className="leading-[15px]">D</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-center relative">
        <Container35 />
        <div className="bg-[#262626] rounded-[9999px] shrink-0 size-[40px]" data-name="Background" />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#141414] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#262626] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[21px] pr-[21.03px] py-[21px] relative w-full">
          <Container19 />
          <Container22 />
          <Container25 />
          <Container28 />
          <Container30 />
          <Container32 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Section2ResumenSemanal() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section 2: Resumen Semanal">
      <Heading1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[20px] text-white tracking-[-0.5px] w-full">
        <p className="leading-[28px]">Última Sesión</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p1a78f580} fill="var(--fill-0, #A1A1A1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[37.53px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[30px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[57.47px]">
        <p className="leading-[15px] mb-0">Volumen</p>
        <p className="leading-[15px]">Total</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
        <Container38 />
        <Container39 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[30px] text-white w-full">
        <p className="leading-[30px]">12,450</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[12px] w-full">
        <p className="leading-[16px]">kg • +5% vs prev</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#1c1c1c] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#262626] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[21px] relative w-full">
        <Container37 />
        <Container40 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[15.75px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 15.75">
        <g id="Container">
          <path d={svgPaths.p35fe5700} fill="var(--fill-0, #A1A1A1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[10px] tracking-[1px] uppercase w-[44.8px]">
        <p className="leading-[15px]">Tiempo</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[30px] text-white w-full">
        <p className="leading-[30px]">58:24</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1a1] text-[12px] w-full">
        <p className="leading-[16px]">min:seg</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#1c1c1c] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#262626] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[21px] relative w-full">
        <Container43 />
        <Container46 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_163px] relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder3 />
      <BackgroundBorder4 />
    </div>
  );
}

function Section3AccesoRapidoStats() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pb-[32px] relative shrink-0 w-full" data-name="Section 3: Acceso Rápido (Stats)">
      <Heading3 />
      <Container36 />
    </div>
  );
}

function Main() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start pt-[24px] px-[24px] relative w-full">
        <HeroSectionIniciarEntrenamiento />
        <Section1ProximoEntrenamiento />
        <Section2ResumenSemanal />
        <Section3AccesoRapidoStats />
      </div>
    </div>
  );
}

export default function InicioGymUpV() {
  return (
    <div className="bg-[#0e0e0e] content-stretch flex flex-col isolate items-start pb-[128px] relative size-full" data-name="Inicio - GymUp (v2)">
      <BottomNavBar />
      <HeaderTopAppBar />
      <Main />
    </div>
  );
}