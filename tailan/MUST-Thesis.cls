
\NeedsTeXFormat{LaTeX2e}[1996/12/01]
\newcommand{\classname}{MUST-Thesis}
\ProvidesClass{\classname}[2016/03/25 v1.4 LaTeXTemplates.com]
\providecommand{\baseclass}{book}

\RequirePackage{etoolbox}
\RequirePackage{xparse}
\newbool{nolistspace}
\newbool{chapteroneline}
\newbool{listtoc}
\newbool{toctoc}
\newbool{parskip}
\newbool{hyperrefsupport}
\booltrue{hyperrefsupport}
\newbool{headsepline}

\DeclareOption{nohyperref}{\boolfalse{hyperrefsupport}}
\DeclareOption{nolistspacing}{\booltrue{nolistspace}}
\DeclareOption{liststotoc}{\booltrue{listtoc}}
\DeclareOption{chapterinoneline}{\booltrue{chapteroneline}}
\DeclareOption{toctotoc}{\booltrue{toctoc}}
\DeclareOption{parskip}{\booltrue{parskip}}
\DeclareOption{headsepline}{\booltrue{headsepline}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{\baseclass}}

\ProcessOptions\relax

\LoadClass{\baseclass}
\ifbool{parskip}{\RequirePackage{parskip}}

\newcommand{\abovechapterspace}{\vspace*{50pt}}
\patchcmd{\@makechapterhead}{\vspace*{50\p@}}{\abovechapterspace}{}{}
\patchcmd{\@makeschapterhead}{\vspace*{50\p@}}{\abovechapterspace}{}{}
\newcommand{\autodot}{}
\newcommand{\mdtChapapp}{}
\ifbool{chapteroneline}{
	\patchcmd{\@makechapterhead}{
		\if@mainmatter
		\huge\bfseries \@chapapp\space \thechapter
		\par\nobreak
		\vskip 20\p@
		\fi
	}{
		\if@mainmatter
		\Huge\bfseries \mdtChapapp\thechapter\autodot\enspace
		\fi
	}{}{}
}

\ifbool{listtoc}{
	\patchcmd{\listoftables}{\@starttoc{lot}}{
		\addchaptertocentry{\listtablename}\@starttoc{lot}}{}{}
	\patchcmd{\listoffigures}{\@starttoc{lof}}{
		\addchaptertocentry{\listfigurename}\@starttoc{lof}}{}{}
}

\ifbool{toctoc}{
	\patchcmd{\tableofcontents}{\@starttoc{toc}}{
		\addchaptertocentry{\contentsname}\@starttoc{toc}}{}{}
}

\patchcmd{\tableofcontents}{\MakeUppercase}{\MakeMarkcase}{}{}
\patchcmd{\tableofcontents}{\MakeUppercase}{\MakeMarkcase}{}{}
\patchcmd{\listoffigures}{\MakeUppercase}{\MakeMarkcase}{}{}
\patchcmd{\listoffigures}{\MakeUppercase}{\MakeMarkcase}{}{}
\patchcmd{\listoftables}{\MakeUppercase}{\MakeMarkcase}{}{}
\patchcmd{\listoftables}{\MakeUppercase}{\MakeMarkcase}{}{}
\ifbool{nolistspace}{
	\patchcmd{\listoffigures}{
		\@starttoc{lof}}{
			\begingroup
			\singlespace\@starttoc{lof}\endgroup
		}{}{}
	\patchcmd{\listoftables}{
		\@starttoc{lot}}{
			\begingroup
			\singlespace\@starttoc{lot}\endgroup
		}{}{}
	\patchcmd{\tableofcontents}{
		\@starttoc{toc}}{
			\begingroup
			\singlespace\@starttoc{toc}\endgroup
		}{}{}
}{}
\ProvideDocumentCommand{\addchap}{ s o m }{
	\chapter*{#3}
	\markboth{}{}
	\IfBooleanTF{#1}{
	}{
		\IfNoValueTF{#2}{
			\addchaptertocentry{#3}
			\markboth{\MakeMarkcase{#3}}{\MakeMarkcase{#3}}
		}{
			\addchaptertocentry{#2}
			\markboth{\MakeMarkcase{#2}}{\MakeMarkcase{#2}}
		}
	}
}

\ProvideDocumentCommand{\addsec}{ s o m }{
	\section*{#3}
	\markright{}
	\IfBooleanTF{#1}{
	}{
		\IfNoValueTF{#2}{
			\addcontentsline{toc}{section}{#3}
			\markright{\MakeMarkcase{#3}}
		}{
			\addcontentsline{toc}{section}{#2}
			\markright{\MakeMarkcase{#2}}
		}
	}
}

\RequirePackage{setspace}

\RequirePackage{longtable}

\PassOptionsToPackage{table}{xcolor}
\RequirePackage{xcolor}

\RequirePackage{graphicx}
\graphicspath{{Figures/}{./}}

\RequirePackage{booktabs}

\RequirePackage{caption}
\captionsetup{justification=centerlast,font=small,labelfont=sc,margin=50pt}

\newcommand{\checktoopen}{
\if@openright\cleardoublepage\else\clearpage\fi
\ifdef{\phantomsection}{\phantomsection}{}
}

\newcommand\bhrule{\typeout{--------------------}}
\newcommand\tttypeout[1]{\bhrule\typeout{\space #1}\bhrule}

\newcommand{\HRule}{\rule{\linewidth}{0.5mm}}

\renewcommand{\abovechapterspace}{\vspace*{10pt}}

\setcounter{tocdepth}{3}
\providecommand\addchaptertocentry[1]{
\addcontentsline{toc}{chapter}{#1}
}

\newcommand\myformat{
\titleformat{\chapter}[display]
{
	\normalfont
	\Large
	\centering
	\bfseries
}
{
	\vspace*{\fill}
	\titlerule[1pt]
	\vspace{1pt}
	\titlerule
	\vspace{1pc}
	\LARGE\MakeUppercase{\chaptertitlename}~\thechapter
}
{
	1pc
}
{
	\titlerule
	\Huge
}
[
	\vspace*{\fill}
	\thispagestyle{empty}
	\clearpage
	\addtocounter{page}{-1}
]

}

\newcommand\defformat{
\titleformat{\chapter}[display]
{\normalfont\huge\bfseries}{\chaptertitlename\ \thechapter}{20pt}{\Huge}
}

\RequirePackage{geometry}

\geometry{
	headheight=36pt,
	paper=a4paper,
	inner=3.0cm,
	outer=1.5cm,
	bindingoffset=0cm,
	top=2.0cm,
	bottom=2.0cm,
	footskip=1.0cm,
}
\raggedbottom

\doublehyphendemerits=10000
\brokenpenalty=10000
\widowpenalty=9999
\clubpenalty=9999
\interfootnotelinepenalty=9999

\RequirePackage[markcase=used]{scrlayer-scrpage}
\providepairofpagestyles{thesisSimple}{
\clearpairofpagestyles
\automark[chapter]{chapter}
\ihead{\leftmark}
\cfoot[\pagemark]{\pagemark}
}
\ifoot{}
\ofoot{}

\pagestyle{thesisSimple}
\providepairofpagestyles[thesisSimple]{thesis}{
\automark*[section]{}
}
\providepairofpagestyles[thesisSimple]{review}{
	\ofoot[\ttitle/\authorname]{\ttitle/\authorname}
	\ifoot[\today]{\today}
}
\pagestyle{thesis}
\ifbool{headsepline}{\KOMAoption{headsepline}{true}}{}
\PreventPackageFromLoading[\ClassError{\classname}{Package `fancyhdr' is
incompatible\MessageBreak with this class}{The pagesyles are defined
using package `scrlayer-scrpage', please consult the\MessageBreak
KOMA-script documentation for details.}]{fancyhdr}

\newcommand{\blank@p@gestyle}{empty}
\newcommand{\blankpagestyle}[1]{\def\blank@p@gestyle{#1}}

\def\cleardoublepage{\clearpage\if@twoside \ifodd\c@page\else
\hbox{}
\thispagestyle{\blank@p@gestyle}
\newpage
\if@twocolumn\hbox{}\newpage\fi\fi\fi}

\def\ttitle{}
\newcommand*{\supervisor}[1]{\def\supname{#1}}
\newcommand*{\thesistitle}[1]{\def\@title{#1}\def\ttitle{#1}}
\newcommand*{\thesistype}[1]{\def\thesisname{#1}}
\newcommand*{\reader}[1]{\def\readname{#1}}
\newcommand*{\advisor}[1]{\def\advicename{#1}}
\newcommand*{\degreeind}[1]{\def\degreeid{#1}}
\newcommand*{\degree}[1]{\def\degreename{#1}}
\newcommand*{\authorshort}[1]{\def\shortname{#1}}
\newcommand*{\authorlong}[1]{\def\longname{#1}}
\newcommand*{\addresses}[1]{\def\addressname{#1}}
\newcommand*{\university}[1]{\def\univname{#1}}
\newcommand*{\department}[1]{\def\deptname{#1}}
\newcommand*{\deptchair}[1]{\def\chairname{#1}}
\newcommand*{\group}[1]{\def\groupname{#1}}
\newcommand*{\faculty}[1]{\def\facname{#1}}
\newcommand*{\subject}[1]{\def\subjectname{#1}}
\newcommand*{\keywords}[1]{\def\keywordnames{#1}}

\newenvironment{declaration}{
	\checktoopen
	\tttypeout{\authorshipname}
	\thispagestyle{plain}
	\null\vfil
	{\noindent\huge\bfseries\authorshipname\par\vspace{10pt}}
}{}

\newcommand\dedicatory[1]{
	\checktoopen
	\tttypeout{Dedicatory}
	\null\vfil
	\thispagestyle{plain}
	\begin{center}{\Large\slshape #1}\end{center}
	\vfil\null
}

\newenvironment{abstract}{
	\checktoopen
	\tttypeout{\abstractname}
	\null\vfil
	\thispagestyle{plain}
	\begin{center}
	{\scshape\Large \univname\par}
	{\scshape\large \facname\par}\vspace{0.5cm}
	{\huge\textbf{{\abstractname}} \par}
	\bigskip \
	{\normalsize \Large{\@title} \par}
	\medskip
	{\normalsize \shortname \par} \\
	\addressname
	\end{center}
}

\NewDocumentEnvironment{abbreviations}{ m }{
	\ifbool{nolistspace}{\begingroup\singlespacing}{}
	\ifbool{listtoc}{\addchap{\abbrevname}}{\addchap*{\abbrevname}}
	\begin{longtable}{#1}
}{
\end{longtable}
\addtocounter{table}{-1}
\ifbool{nolistspace}{\endgroup}{}
}

\NewDocumentEnvironment{constants}{ m }{
	\ifbool{nolistspace}{\begingroup\singlespacing}{}
	\ifbool{listtoc}{\addchap{\constantsname}}{\addchap*{\constantsname}}
	\begin{longtable}{#1}
	}{
\end{longtable}
\addtocounter{table}{-1}
\ifbool{nolistspace}{\endgroup}{}
}

\NewDocumentEnvironment{symbols}{ m }{
	\ifbool{nolistspace}{\begingroup\singlespacing}{}
	\ifbool{listtoc}{\addchap{\symbolsname}}{\addchap*{\symbolsname}}
	\begin{longtable}{#1}
	}{
	\end{longtable}
	\addtocounter{table}{-1}
	\ifbool{nolistspace}{\endgroup}{}
}

\NewDocumentEnvironment{acknowledgements}{}{
\checktoopen
\tttypeout{\acknowledgementname}
\thispagestyle{plain}
\begin{center}{\huge \textbf{{\acknowledgementname}}\par}\end{center}
}
{
\vfil\vfil\null
}

\ifbool{hyperrefsupport}{
\AfterPackage{biblatex}{
\RequirePackage{hyperref}
\hypersetup{pdfpagemode={UseOutlines},
bookmarksopen=true,
bookmarksopenlevel=0,
hypertexnames=false,
colorlinks=true,
citecolor=magenta,
linkcolor=red,
urlcolor=black,
pdfstartview={FitV},
unicode,
breaklinks=true,
}

\pdfstringdefDisableCommands{
   \let\\\space
}
}
}{
}

\endinput
