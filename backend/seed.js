const Unit = require('./models/Unit');
const Lesson = require('./models/Lesson');
const Exercise = require('./models/Exercise');

const curriculum = [
  {
    title: 'Premiers mots',
    description: 'Saluer, se présenter et échanger ses premiers mots en wolof.',
    order: 1,
    level: 1,
    lessons: [
      {
        title: 'Les salutations',
        description: 'Dire bonjour et répondre à une salutation.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Comment dit-on « Bonjour » en wolof ?',
            options: ['Salaam aleekum', 'Jërëjëf', 'Déedéet'],
            correctAnswer: 'Salaam aleekum'
          },
          {
            type: 'multiple_choice',
            question: 'Que signifie « Jërëjëf » en français ?',
            options: ['Bonjour', 'Merci', 'Au revoir'],
            correctAnswer: 'Merci'
          }
        ]
      },
      {
        title: 'Se présenter',
        description: 'Dire son nom et demander celui de son interlocuteur.',
        exercises: [
          {
            type: 'translation',
            question: 'Traduisez en wolof : « Comment vous appelez-vous ? »',
            options: [],
            correctAnswer: 'Naka nga tudd ?'
          },
          {
            type: 'translation',
            question: 'Complétez en wolof : « Je m’appelle Awa. »',
            options: [],
            correctAnswer: 'Maa ngi tudd Awa.'
          }
        ]
      },
      {
        title: 'Oui et non',
        description: 'Répondre simplement par oui ou par non.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Comment dit-on « Oui » en wolof ?',
            options: ['Déedéet', 'Waaw', 'Jërëjëf'],
            correctAnswer: 'Waaw'
          },
          {
            type: 'multiple_choice',
            question: 'Comment dit-on « Non » en wolof ?',
            options: ['Waaw', 'Salaam aleekum', 'Déedéet'],
            correctAnswer: 'Déedéet'
          }
        ]
      }
    ]
  },
  {
    title: 'Vie quotidienne',
    description: 'Parler de sa famille, de la nourriture et des nombres.',
    order: 2,
    level: 1,
    lessons: [
      {
        title: 'La famille',
        description: 'Reconnaître et nommer les membres de la famille.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof signifie « mère » ?',
            options: ['Yaay', 'Baay', 'Xarit'],
            correctAnswer: 'Yaay'
          },
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof signifie « père » ?',
            options: ['Yaay', 'Baay', 'Ndekki'],
            correctAnswer: 'Baay'
          }
        ]
      },
      {
        title: 'Les repas',
        description: 'Parler des repas et des aliments du quotidien.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof désigne le riz ?',
            options: ['Ceeb', 'Ndox', 'Mburu'],
            correctAnswer: 'Ceeb'
          },
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof désigne l’eau ?',
            options: ['Ceeb', 'Ndox', 'Yaay'],
            correctAnswer: 'Ndox'
          }
        ]
      },
      {
        title: 'Les nombres',
        description: 'Découvrir les nombres utiles dans les échanges quotidiens.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Quel nombre signifie « un » en wolof ?',
            options: ['Benn', 'Ñaar', 'Ñett'],
            correctAnswer: 'Benn'
          },
          {
            type: 'multiple_choice',
            question: 'Quel nombre signifie « deux » en wolof ?',
            options: ['Ñett', 'Benn', 'Ñaar'],
            correctAnswer: 'Ñaar'
          }
        ]
      }
    ]
  },
  {
    title: 'Communication',
    description: 'Poser des questions, demander son chemin et faire des achats.',
    order: 3,
    level: 1,
    lessons: [
      {
        title: 'Demander son chemin',
        description: 'Demander où se trouve un lieu et comprendre une indication.',
        exercises: [
          {
            type: 'translation',
            question: 'Traduisez en wolof : « Où est … ? »',
            options: [],
            correctAnswer: 'Fan la … ?'
          },
          {
            type: 'multiple_choice',
            question: 'Vous cherchez un lieu. Quelle expression wolof pouvez-vous utiliser ?',
            options: ['Fan la … ?', 'Jërëjëf', 'Waaw'],
            correctAnswer: 'Fan la … ?'
          }
        ]
      },
      {
        title: 'Au marché',
        description: 'Employer des expressions simples pour acheter quelque chose.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof signifie « argent » ?',
            options: ['Xaalis', 'Ndox', 'Ceeb'],
            correctAnswer: 'Xaalis'
          },
          {
            type: 'translation',
            question: 'Comment dit-on « Combien ? » en wolof ?',
            options: [],
            correctAnswer: 'Ñaata ?'
          }
        ]
      },
      {
        title: 'Poser des questions',
        description: 'Utiliser quelques mots interrogatifs dans une conversation.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof signifie « qui ? »',
            options: ['Kan ?', 'Fan ?', 'Lu ?'],
            correctAnswer: 'Kan ?'
          },
          {
            type: 'multiple_choice',
            question: 'Quel mot wolof signifie « où ? »',
            options: ['Lu ?', 'Fan ?', 'Kan ?'],
            correctAnswer: 'Fan ?'
          }
        ]
      }
    ]
  },
  {
    title: 'Comprendre une conversation',
    description: 'Comprendre des expressions courantes et en saisir le sens.',
    order: 4,
    level: 2,
    lessons: [
      {
        title: 'Comprendre les salutations',
        description: 'Reconnaître des salutations et des réponses dans une conversation.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez la phrase en wolof et choisissez la traduction correcte.',
            listenText: 'Naka nga def ?',
            answerLanguage: 'fr-FR',
            options: ['Comment allez-vous ?', 'Quel est votre nom ?', 'Combien ça coûte ?'],
            correctAnswer: 'Comment allez-vous ?'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez la réponse en wolof et choisissez son sens.',
            listenText: 'Maa ngi fi.',
            answerLanguage: 'fr-FR',
            options: ['Je vais bien.', 'Je m’appelle Awa.', 'Au revoir.'],
            correctAnswer: 'Je vais bien.'
          }
        ]
      },
      {
        title: 'Suivre un échange',
        description: 'Comprendre une courte réponse et identifier une question.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez la question en wolof et choisissez sa traduction.',
            listenText: 'Naka nga tudd ?',
            answerLanguage: 'fr-FR',
            options: ['Comment vous appelez-vous ?', 'Où allez-vous ?', 'Est-ce de l’eau ?'],
            correctAnswer: 'Comment vous appelez-vous ?'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez cette réponse en wolof.',
            listenText: 'Maa ngi tudd Awa.',
            answerLanguage: 'fr-FR',
            options: ['Je m’appelle Awa.', 'Je voudrais de l’eau.', 'Merci beaucoup.'],
            correctAnswer: 'Je m’appelle Awa.'
          }
        ]
      },
      {
        title: 'Comprendre les formules de politesse',
        description: 'Reconnaître des expressions utiles pour commencer et terminer un échange.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez la formule en wolof puis choisissez sa traduction.',
            listenText: 'Jërëjëf.',
            answerLanguage: 'fr-FR',
            options: ['Merci.', 'Bonjour.', 'Non.'],
            correctAnswer: 'Merci.'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez cette formule de salutation en wolof.',
            listenText: 'Salaam aleekum.',
            answerLanguage: 'fr-FR',
            options: ['Bonjour.', 'Combien ?', 'Où est-ce ?'],
            correctAnswer: 'Bonjour.'
          }
        ]
      }
    ]
  },
  {
    title: 'S’exprimer au quotidien',
    description: 'Formuler ses besoins et poser des questions dans des situations courantes.',
    order: 5,
    level: 2,
    lessons: [
      {
        title: 'Exprimer un besoin',
        description: 'Formuler une demande simple et en comprendre la réponse.',
        exercises: [
          {
            type: 'translation',
            question: 'Traduisez en wolof : « Je voudrais de l’eau. »',
            answerLanguage: 'wo-SN',
            options: [],
            correctAnswer: 'Dama bëgg ndox.'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez la demande en wolof puis choisissez ce qui est demandé.',
            listenText: 'Dama bëgg ndox.',
            answerLanguage: 'fr-FR',
            options: ['De l’eau.', 'Du riz.', 'Un nom.'],
            correctAnswer: 'De l’eau.'
          }
        ]
      },
      {
        title: 'Parler des repas',
        description: 'Comprendre et formuler une demande liée aux repas.',
        exercises: [
          {
            type: 'translation',
            question: 'Traduisez en wolof : « Je voudrais du riz. »',
            answerLanguage: 'wo-SN',
            options: [],
            correctAnswer: 'Dama bëgg ceeb.'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez la demande en wolof et choisissez ce que la personne souhaite.',
            listenText: 'Dama bëgg ceeb.',
            answerLanguage: 'fr-FR',
            options: ['Du riz.', 'De l’eau.', 'Un marché.'],
            correctAnswer: 'Du riz.'
          }
        ]
      },
      {
        title: 'Poser des questions pratiques',
        description: 'Réutiliser les questions utiles pour demander un prix ou un lieu.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez la question en wolof et choisissez son sens.',
            listenText: 'Ñaata ?',
            answerLanguage: 'fr-FR',
            options: ['Combien ?', 'Qui ?', 'Où ?'],
            correctAnswer: 'Combien ?'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez la question en wolof et choisissez son sens.',
            listenText: 'Fan la … ?',
            answerLanguage: 'fr-FR',
            options: ['Où est … ?', 'Comment allez-vous ?', 'Quel est votre nom ?'],
            correctAnswer: 'Où est … ?'
          }
        ]
      }
    ]
  },
  {
    title: 'Mettre en pratique',
    description: 'Combiner les acquis pour suivre et construire de petits échanges.',
    order: 6,
    level: 2,
    lessons: [
      {
        title: 'Se présenter dans un échange',
        description: 'Suivre un échange simple autour du nom et des salutations.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez et choisissez la traduction de cette présentation.',
            listenText: 'Maa ngi tudd Awa.',
            answerLanguage: 'fr-FR',
            options: ['Je m’appelle Awa.', 'Je voudrais de l’eau.', 'Où est Awa ?'],
            correctAnswer: 'Je m’appelle Awa.'
          },
          {
            type: 'translation',
            question: 'Traduisez en wolof : « Comment vous appelez-vous ? »',
            answerLanguage: 'wo-SN',
            options: [],
            correctAnswer: 'Naka nga tudd ?'
          }
        ]
      },
      {
        title: 'Comprendre sans aide',
        description: 'Écouter attentivement et retrouver le sens d’expressions connues.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez l’expression en wolof et choisissez sa traduction.',
            listenText: 'Déedéet.',
            answerLanguage: 'fr-FR',
            options: ['Non.', 'Oui.', 'Merci.'],
            correctAnswer: 'Non.'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez l’expression en wolof et choisissez sa traduction.',
            listenText: 'Waaw.',
            answerLanguage: 'fr-FR',
            options: ['Oui.', 'Non.', 'Bonjour.'],
            correctAnswer: 'Oui.'
          }
        ]
      },
      {
        title: 'Réviser en situation',
        description: 'Mobiliser plusieurs expressions pour terminer le parcours débutant.',
        exercises: [
          {
            type: 'multiple_choice',
            question: 'Lisez la phrase en wolof et choisissez ce que la personne demande.',
            listenText: 'Dama bëgg ndox.',
            answerLanguage: 'fr-FR',
            options: ['De l’eau.', 'Du riz.', 'L’heure.'],
            correctAnswer: 'De l’eau.'
          },
          {
            type: 'multiple_choice',
            question: 'Lisez la question en wolof et choisissez son sens.',
            listenText: 'Naka nga def ?',
            answerLanguage: 'fr-FR',
            options: ['Comment allez-vous ?', 'Combien ?', 'Où est-ce ?'],
            correctAnswer: 'Comment allez-vous ?'
          }
        ]
      }
    ]
  }
];

const seedData = async () => {
  for (const unitData of curriculum) {
    const unit = await Unit.findOneAndUpdate(
      { title: unitData.title },
      {
        $set: {
          title: unitData.title,
          description: unitData.description,
          order: unitData.order,
          level: unitData.level
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const lessonIds = [];
    for (const [index, lessonData] of unitData.lessons.entries()) {
      const lesson = await Lesson.findOneAndUpdate(
        { unit: unit._id, order: index + 1 },
        {
          $set: {
            title: lessonData.title,
            description: lessonData.description,
            unit: unit._id,
            order: index + 1,
            xpReward: unitData.level === 1 ? 10 : 20
          }
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );

      const exerciseIds = [];
      for (const [exerciseIndex, exerciseData] of lessonData.exercises.entries()) {
        const seedKey = `${unitData.order}-${index + 1}-${exerciseIndex + 1}`;
        let exercise = await Exercise.findOne({ seedKey });
        if (!exercise) {
          exercise = await Exercise.findOne({
            question: exerciseData.question,
            correctAnswer: exerciseData.correctAnswer,
            listenText: exerciseData.listenText || null,
            seedKey: { $exists: false }
          });
        }
        if (!exercise) exercise = new Exercise();
        Object.assign(exercise, {
          ...exerciseData,
          seedKey,
          points: unitData.level === 1 ? 5 : 10
        });
        await exercise.save();
        exerciseIds.push(exercise._id);
      }

      lesson.exercises = exerciseIds;
      await lesson.save();
      lessonIds.push(lesson._id);
    }

    unit.lessons = lessonIds;
    await unit.save();
  }

  console.log('Unités, leçons et exercices initialisés.');
};

module.exports = { seedData };
