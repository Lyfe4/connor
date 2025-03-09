import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FileText, List, Plus, X, Save, Upload } from 'lucide-react';

// Component for the expandable units list
const UnitsList = ({ tierLevel, tierTheme }) => {
  // State for form visibility
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentUnitId, setCurrentUnitId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  
  // Form state
  const [newUnit, setNewUnit] = useState({
    title: "",
    description: "",
    topics: []
  });
  
  const [editorContent, setEditorContent] = useState("");
  const [files, setFiles] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState("explanation");
  const [aiPrompt, setAiPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
  
  // Add theme-aware rendering for cards
  const getCardStyle = () => {
    return {
      backgroundColor: tierTheme.cardBg || 'rgba(255, 255, 255, 0.1)',
      borderColor: tierTheme.cardBorder || 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
    };
  };
  
  const getHeaderStyle = () => {
    return {
      color: tierTheme.textColor || 'white',
      borderBottom: `1px solid ${tierTheme.cardBorder || 'rgba(255, 255, 255, 0.2)'}`,
      background: `linear-gradient(to bottom, ${tierTheme.cardBg || 'rgba(255, 255, 255, 0.1)'}, rgba(0, 0, 0, 0))`
    };
  };
  
  const getButtonStyle = () => {
    return {
      backgroundColor: tierTheme.buttonBg || 'rgba(255, 255, 255, 0.2)',
      color: tierTheme.textColor || 'white',
      borderColor: tierTheme.buttonBorder || 'rgba(255, 255, 255, 0.3)'
    };
  };
  
  // AI model options for Tier 4
  const aiModels = [
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "llama-3-70b", name: "Llama 3 70B" }
  ];
  
  // Quiz questions for Tier 3
  const [quizQuestions, setQuizQuestions] = useState([
    { 
      question: "What literary device involves a comparison using 'like' or 'as'?", 
      options: ["Metaphor", "Simile", "Personification", "Alliteration"], 
      answer: "Simile" 
    },
    { 
      question: "Which narrative perspective uses 'I', 'me', and 'my'?", 
      options: ["First person", "Second person", "Third person limited", "Third person omniscient"], 
      answer: "First person" 
    },
    { 
      question: "What is the term for the moment of highest tension in a story?", 
      options: ["Exposition", "Rising action", "Climax", "Resolution"], 
      answer: "Climax" 
    }
  ]);
  
  // More advanced quiz questions for Tier 4
  const [tier4QuizQuestions, setTier4QuizQuestions] = useState([
    { 
      question: "Which of the following research methods would be most appropriate for studying cultural practices within a specific community over an extended period?", 
      options: ["Survey research", "Experimental design", "Ethnography", "Meta-analysis"], 
      answer: "Ethnography" 
    },
    { 
      question: "In research methodology, what does 'triangulation' refer to?", 
      options: ["Using three separate statistical tests", "Presenting findings in triangle diagrams", "Using multiple methods to study the same phenomenon", "Applying theory from three different fields"], 
      answer: "Using multiple methods to study the same phenomenon" 
    },
    { 
      question: "Which philosophical approach is most closely associated with the rejection of universal metanarratives?", 
      options: ["Structuralism", "Positivism", "Postmodernism", "Empiricism"], 
      answer: "Postmodernism" 
    },
    { 
      question: "What methodological approach emphasizes the interpretation of texts within their historical and cultural contexts?", 
      options: ["Hermeneutics", "Grounded theory", "Positivism", "Experimental design"], 
      answer: "Hermeneutics" 
    }
  ]);
  
  const fileInputRef = useRef(null);
  
  // Sample data for units, topics, and subtopics - different sets for each tier
  const tier1Units = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      description: "Foundational concepts in computing",
      topics: [
        {
          id: 101,
          title: "Algorithms and Data Structures",
          subtopics: ["Big O Notation", "Sorting Algorithms", "Binary Trees"]
        },
        {
          id: 102,
          title: "Programming Fundamentals",
          subtopics: ["Variables & Types", "Control Structures", "Functions"]
        }
      ]
    },
    {
      id: 2,
      title: "Web Development",
      description: "Building modern web applications",
      topics: [
        {
          id: 201,
          title: "Frontend Technologies",
          subtopics: ["HTML5", "CSS3", "JavaScript Frameworks"]
        },
        {
          id: 202,
          title: "Backend Development",
          subtopics: ["RESTful APIs", "Database Design", "Authentication"]
        }
      ]
    }
  ];
  
  const tier2Units = [
    {
      id: 101,
      title: "Biochemistry Essentials",
      description: "Core principles of biochemistry",
      topics: [
        {
          id: 1001,
          title: "Protein Structure and Function",
          subtopics: ["Amino Acids", "Protein Folding", "Enzymes"]
        },
        {
          id: 1002,
          title: "Cellular Metabolism",
          subtopics: ["Glycolysis", "Krebs Cycle", "Electron Transport Chain"]
        }
      ]
    },
    {
      id: 102,
      title: "Organic Chemistry",
      description: "Fundamentals of organic compounds",
      topics: [
        {
          id: 2001,
          title: "Functional Groups",
          subtopics: ["Alcohols", "Carbonyls", "Carboxylic Acids"]
        },
        {
          id: 2002,
          title: "Reaction Mechanisms",
          subtopics: ["Nucleophilic Substitution", "Elimination", "Addition"]
        }
      ]
    }
  ];
  
  const tier3Units = [
    {
      id: 201,
      title: "Literary Analysis",
      description: "Techniques for analyzing literature",
      topics: [
        {
          id: 3001,
          title: "Narrative Structure",
          subtopics: ["Plot Development", "Character Analysis", "Setting & Context"]
        },
        {
          id: 3002,
          title: "Literary Devices",
          subtopics: ["Symbolism", "Metaphor & Analogy", "Thematic Elements"]
        }
      ]
    },
    {
      id: 202,
      title: "Creative Writing",
      description: "Principles of effective creative writing",
      topics: [
        {
          id: 4001,
          title: "Fiction Writing",
          subtopics: ["Character Development", "Dialogue", "World Building"]
        },
        {
          id: 4002,
          title: "Poetry",
          subtopics: ["Rhythm & Meter", "Imagery", "Poetic Forms"]
        }
      ]
    }
  ];
  const tier4Units = [
    {
      id: 301,
      title: "Research Methodology",
      description: "Advanced approaches to academic research",
      topics: [
        {
          id: 5001,
          title: "Qualitative Research",
          subtopics: ["Grounded Theory", "Ethnography", "Phenomenology"]
        },
        {
          id: 5002,
          title: "Quantitative Analysis",
          subtopics: ["Statistical Methods", "Data Visualization", "Experimental Design"]
        }
      ]
    },
    {
      id: 302,
      title: "Advanced Theory",
      description: "Theoretical frameworks for critical analysis",
      topics: [
        {
          id: 6001,
          title: "Critical Theory",
          subtopics: ["Post-structuralism", "Feminist Theory", "Cultural Studies"]
        },
        {
          id: 6002,
          title: "Ethics and Philosophy",
          subtopics: ["Applied Ethics", "Philosophical Approaches", "Contemporary Debates"]
        }
      ]
    }
  ];
  
  // Select appropriate units based on tier level
  let initialUnits;
  if (tierLevel === 1) {
    initialUnits = tier1Units;
  } else if (tierLevel === 2) {
    initialUnits = tier2Units;
  } else if (tierLevel === 3) {
    initialUnits = tier3Units;
  } else if (tierLevel === 4) {
    initialUnits = tier4Units;
  } else {
    initialUnits = [];
  }
  
  const [units, setUnits] = useState(initialUnits);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  
  // Update AI prompt when teaching method changes (for Tier 3 and Tier 4)
  useEffect(() => {
    if (tierLevel === 3 || tierLevel === 4) {
      // Define prompts for each teaching method
      const prompts = {
        explanation: "Explain the concept of [topic] clearly and comprehensively. Include key definitions, examples, and applications.",
        quizzes: "Create a set of quiz questions about [topic] that test understanding at different levels of difficulty. Include answers and explanations.",
        socratic: "Engage the student in a Socratic dialogue about [topic]. Ask thought-provoking questions that lead them to discover key insights.",
        roleplay: "Create a roleplay scenario where the student takes on the role of a literary critic analyzing [topic]. Guide them through the analysis process.",
        simulation: "Simulate a literary analysis session where the student explores [topic] through guided close reading and interpretation.",
        custom: customPrompt // Use the custom prompt if selected
      };
      
      // For Tier 4, use more advanced/specialized prompts unless custom is selected
      if (tierLevel === 4) {
        if (teachingMethod !== "custom") {
          prompts.explanation = "Provide a comprehensive explanation of [topic] that integrates multiple theoretical perspectives. Include advanced concepts, critical analysis, and current research findings.";
          prompts.quizzes = "Create advanced-level quiz questions about [topic] that require deep critical thinking, synthesis of concepts, and application to novel situations.";
          prompts.socratic = "Engage in a sophisticated Socratic dialogue about [topic], exploring theoretical foundations, methodological issues, and competing interpretations.";
          prompts.roleplay = "Design a complex roleplay scenario where the student assumes the role of an expert researcher examining [topic]. Guide them through advanced analysis procedures.";
          prompts.simulation = "Simulate a research colloquium on [topic] where multiple theoretical perspectives are debated and synthesized.";
        }
      }
      
      setAiPrompt(prompts[teachingMethod] || "");
    }
  }, [teachingMethod, tierLevel, customPrompt]);
  
  // Function to handle adding a new unit
  const handleAddUnit = () => {
    if (newUnit.title.trim() === "") return;
    
    const unitId = Date.now();
    const unitToAdd = {
      id: unitId,
      title: newUnit.title,
      description: newUnit.description,
      topics: newUnit.topics
    };
    
    setUnits([...units, unitToAdd]);
    setNewUnit({ title: "", description: "", topics: [] });
    setShowAddForm(false);
  };
  
  // Rich Text Editor Toolbar Actions
  const handleBold = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalic = () => {
    document.execCommand('italic', false, null);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false, null);
  };

  const handleBulletList = () => {
    document.execCommand('insertUnorderedList', false, null);
  };

  const handleNumberList = () => {
    document.execCommand('insertOrderedList', false, null);
  };
  
  // File handling
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  // Handle saving content as a new topic or updating existing topic
  const handleSaveContent = () => {
    if (currentUnitId === null) return;
    
    const contentElement = document.getElementById('rich-text-editor');
    const htmlContent = contentElement ? contentElement.innerHTML : '';
    
    if (editingTopicId) {
      // Update existing topic
      setUnits(units.map(unit => {
        if (unit.id === currentUnitId) {
          return {
            ...unit,
            topics: unit.topics.map(topic => {
              if (topic.id === editingTopicId) {
                return {
                  ...topic,
                  content: htmlContent,
                  files: files.map(file => file.name),
                  teachingMethod: (tierLevel === 2 || tierLevel === 3 || tierLevel === 4) ? teachingMethod : topic.teachingMethod,
                  customPrompt: tierLevel === 4 && teachingMethod === "custom" ? customPrompt : topic.customPrompt,
                  aiModel: tierLevel === 4 ? selectedModel : topic.aiModel
                };
              }
              return topic;
            })
          };
        }
        return unit;
      }));
    } else {
      // Add new topic
      const topicId = Date.now();
      const topicToAdd = {
        id: topicId,
        content: htmlContent,
        files: files.map(file => file.name),
        subtopics: [],
        teachingMethod: (tierLevel === 2 || tierLevel === 3 || tierLevel === 4) ? teachingMethod : undefined,
        customPrompt: tierLevel === 4 && teachingMethod === "custom" ? customPrompt : undefined,
        aiModel: tierLevel === 4 ? selectedModel : undefined
      };
      
      setUnits(units.map(unit => {
        if (unit.id === currentUnitId) {
          return {
            ...unit,
            topics: [...unit.topics, topicToAdd]
          };
        }
        return unit;
      }));
    }
    
    setEditorContent("");
    setFiles([]);
    setTeachingMethod("explanation");
    setCustomPrompt("");
    setSelectedModel("claude-3-5-sonnet");
    setShowEditor(false);
    setEditingTopicId(null);
  };
  
  // Function to start adding a topic to a specific unit
  const startAddTopic = (unitId) => {
    setCurrentUnitId(unitId);
    setEditingTopicId(null);
    setEditorContent("");
    setFiles([]);
    setTeachingMethod("explanation");
    setCustomPrompt("");
    setSelectedModel("claude-3-5-sonnet");
    setShowEditor(true);
  };
  
  // Function to start editing an existing topic
  const startEditTopic = (unitId, topicId) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;
    
    const topic = unit.topics.find(t => t.id === topicId);
    if (!topic) return;
    
    setCurrentUnitId(unitId);
    setEditingTopicId(topicId);
    setEditorContent(topic.content || "");
    setFiles(topic.files ? topic.files.map(filename => ({ name: filename })) : []);
    setTeachingMethod(topic.teachingMethod || "explanation");
    setCustomPrompt(topic.customPrompt || "");
    setSelectedModel(topic.aiModel || "claude-3-5-sonnet");
    setShowEditor(true);
  };

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };
  return (
    <div>
      {/* Add Unit Button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
          style={getButtonStyle()}
        >
          <Plus size={18} className="mr-2" />
          Add Unit {tierLevel === 2 ? 'to Tier 2' : tierLevel === 4 ? 'to Tier 4' : ''}
        </button>
      </div>
      
      {/* Form for adding a new unit */}
      {showAddForm && (
        <div className="mb-6 rounded-xl p-4 shadow-lg"
            style={{
              backgroundColor: `${tierTheme.cardBg || 'rgba(255, 255, 255, 0.1)'}`,
              borderLeft: `4px solid ${tierTheme.accentColor || tierTheme.gradientFrom}`,
              backdropFilter: 'blur(8px)'
            }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Add New Unit</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-white hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-white text-opacity-80 text-sm mb-1">Unit Title</label>
              <input 
                type="text" 
                value={newUnit.title}
                onChange={(e) => setNewUnit({...newUnit, title: e.target.value})}
                className="w-full bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                placeholder="Enter unit title"
              />
            </div>
            
            <div>
              <label className="block text-white text-opacity-80 text-sm mb-1">Description</label>
              <input 
                type="text" 
                value={newUnit.description}
                onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                className="w-full bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                placeholder="Enter unit description"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleAddUnit}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Save size={18} className="mr-2" />
              Save Unit
            </button>
          </div>
        </div>
      )}
      
      {/* Rich Text Editor and File Drop Area */}
      {showEditor && (
        <div className="mb-6 rounded-xl p-4 shadow-lg"
            style={{
              backgroundColor: `${tierTheme.cardBg || 'rgba(255, 255, 255, 0.1)'}`,
              borderLeft: `4px solid ${tierTheme.accentColor || tierTheme.gradientFrom}`,
              backdropFilter: 'blur(10px)'
            }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">
              {editingTopicId ? "Edit Content" : "Create New Content"}
            </h3>
            <button 
              onClick={() => {
                setShowEditor(false);
                setEditingTopicId(null);
              }}
              className="text-white hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Rich Text Editor */}
          <div className="mb-4">
            {/* Teaching Method Dropdown for Tier 2, 3, and 4 */}
            {(tierLevel === 2 || tierLevel === 3 || tierLevel === 4) && (
              <div className="mb-4">
                <label className="block text-white text-opacity-80 text-sm mb-1">Teaching Method</label>
                <select 
                  value={teachingMethod}
                  onChange={(e) => setTeachingMethod(e.target.value)}
                  className="w-full bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  style={{ backgroundColor: 'rgba(30, 30, 50, 0.5)' }}
                >
                  <option value="explanation" style={{ backgroundColor: '#333', color: 'white' }}>Explanation</option>
                  <option value="quizzes" style={{ backgroundColor: '#333', color: 'white' }}>Quizzes</option>
                  <option value="socratic" style={{ backgroundColor: '#333', color: 'white' }}>Socratic Dialogue</option>
                  <option value="roleplay" style={{ backgroundColor: '#333', color: 'white' }}>Roleplay</option>
                  <option value="simulation" style={{ backgroundColor: '#333', color: 'white' }}>Simulation</option>
                  {tierLevel === 4 && (
                    <option value="custom" style={{ backgroundColor: '#333', color: 'white' }}>Custom Prompt</option>
                  )}
                </select>

                {/* AI Model Selection for Tier 4 only */}
                {tierLevel === 4 && (
                  <div className="mt-3">
                    <label className="block text-white text-opacity-80 text-sm mb-1">AI Model</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                      style={{ backgroundColor: 'rgba(30, 30, 50, 0.5)' }}
                    >
                      {aiModels.map(model => (
                        <option 
                          key={model.id} 
                          value={model.id} 
                          style={{ backgroundColor: '#333', color: 'white' }}
                        >
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom Prompt Textarea for Tier 4 and custom method */}
                {tierLevel === 4 && teachingMethod === "custom" && (
                  <div className="mt-3">
                    <label className="block text-white text-opacity-80 text-sm mb-1">Custom AI Prompt</label>
                    <textarea 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 min-h-[120px]"
                      placeholder="Enter your custom prompt here. Use [topic] as a placeholder for the current topic."
                    />
                  </div>
                )}

                {/* AI Prompt Display for Tier 3 and Tier 4 only */}
                {(tierLevel === 3 || (tierLevel === 4 && teachingMethod !== "custom")) && aiPrompt && (
                  <div className="mt-2">
                    <label className="block text-white text-opacity-80 text-sm mb-1">AI Prompt Template</label>
                    <div 
                      className="w-full bg-white bg-opacity-5 text-white border border-white border-opacity-20 rounded-lg px-3 py-2 min-h-[80px]"
                    >
                      {aiPrompt}
                    </div>
                  </div>
                )}
                
                {/* Quiz Questions Preview for Tier 3 and Tier 4 with Quiz Method */}
                {(tierLevel === 3 || tierLevel === 4) && teachingMethod === "quizzes" && (
                  <div className="mt-4">
                    <label className="block text-white text-opacity-80 text-sm mb-2">Sample Quiz Questions</label>
                    <div className="space-y-4">
                      {(tierLevel === 3 ? quizQuestions : tier4QuizQuestions).map((quiz, index) => (
                        <div key={index} className="bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg p-3">
                          <p className="text-white font-medium mb-2">Q{index + 1}: {quiz.question}</p>
                          <div className="space-y-1 ml-4">
                            {quiz.options.map((option, optIdx) => (
                              <div key={optIdx} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 border ${option === quiz.answer ? 'bg-green-500 border-green-400' : 'border-white border-opacity-30'}`}></div>
                                <span className={`text-sm ${option === quiz.answer ? 'text-green-400' : 'text-white text-opacity-80'}`}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white bg-opacity-10 rounded-t-lg p-2 flex space-x-2 border-b border-white border-opacity-20">
              <button 
                onClick={handleBold}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white font-bold"
                title="Bold"
              >
                B
              </button>
              <button 
                onClick={handleItalic}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white italic"
                title="Italic"
              >
                I
              </button>
              <button 
                onClick={handleUnderline}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white underline"
                title="Underline"
              ></button>
              <button 
                onClick={handleUnderline}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white underline"
                title="Underline"
              >
                U
              </button>
              <div className="border-r border-white border-opacity-20 mx-1 h-6"></div>
              <button 
                onClick={handleBulletList}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white"
                title="Bullet List"
              >
                • List
              </button>
              <button 
                onClick={handleNumberList}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 text-white"
                title="Number List"
              >
                1. List
              </button>
            </div>
            <div
              id="rich-text-editor"
              contentEditable="true"
              className="min-h-32 bg-white bg-opacity-10 rounded-b-lg p-3 text-white focus:outline-none overflow-auto"
              onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editorContent }}
            ></div>
          </div>
          
          {/* File Drop Area */}
          <div 
            className="border-2 border-dashed border-white border-opacity-20 rounded-lg p-4 text-center mb-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            
            <Upload className="mx-auto text-white mb-2" size={24} />
            <p className="text-white text-opacity-80 mb-2">
              Drag & drop files here or
            </p>
            <button 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Browse Files
            </button>
          </div>
          
          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white bg-opacity-5 rounded-lg p-3 mb-4">
              <p className="text-white text-sm mb-2">Attached Files:</p>
              <ul className="space-y-1">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm bg-white bg-opacity-10 p-2 rounded">
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button 
                      onClick={() => removeFile(idx)}
                      className="text-white hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              onClick={handleSaveContent}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                <path d="M7 10a7 7 0 0 0-7 7 1 1 0 0 0 1 1h1a2 2 0 0 1 4 0h10a2 2 0 0 1 4 0h1a1 1 0 0 0 1-1 7 7 0 0 0-7-7"></path>
              </svg>
              {editingTopicId ? "AI-ify Content" : "AI-ify Content"}
            </button>
          </div>
        </div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map(unit => (
          <div key={unit.id} 
               className="rounded-xl overflow-hidden transition-all duration-200 hover:transform hover:scale-[1.01]"
               style={getCardStyle()}>
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleUnit(unit.id)}
              style={getHeaderStyle()}
            >
              <div className="flex items-center">
                <BookOpen className="text-white mr-3" size={20} />
                <div>
                  <h3 className="font-semibold text-white text-lg">{unit.title}</h3>
                  <p className="text-white text-opacity-70 text-sm">{unit.description}</p>
                </div>
              </div>
              <div>
                {expandedUnits[unit.id] ? 
                  <ChevronDown className="text-white" size={20} /> : 
                  <ChevronRight className="text-white" size={20} />
                }
              </div>
            </div>

            {expandedUnits[unit.id] && (
              <div className="p-3" style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderTop: `1px solid ${tierTheme.cardBorder || 'rgba(255, 255, 255, 0.1)'}`
              }}>
                {/* Add Topic Button */}
                <button 
                  onClick={() => startAddTopic(unit.id)}
                  className="flex items-center w-full mb-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Add Topic
                </button>
              
                {unit.topics.map(topic => (
                  <div key={topic.id} className="mb-2 last:mb-0">
                    <div 
                      className="flex items-center justify-between p-2 cursor-pointer rounded hover:bg-white hover:bg-opacity-5"
                    >
                      <div 
                        className="flex items-center flex-grow"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <FileText className="text-white mr-2" size={16} />
                        <span className="text-white">
                          {topic.title || "Document " + topic.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditTopic(unit.id, topic.id);
                          }}
                          className="mr-2 text-white hover:text-blue-300"
                          title="Edit Content"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          </svg>
                        </button>
                        {expandedTopics[topic.id] ? 
                          <ChevronDown className="text-white" size={16} /> : 
                          <ChevronRight className="text-white" size={16} />
                        }
                      </div>
                    </div>

                    {expandedTopics[topic.id] && (
                      <div className="ml-7 mt-1 mb-2">
                        {/* Teaching method display */}
                        {(tierLevel === 2 || tierLevel === 3 || tierLevel === 4) && topic.teachingMethod && (
                          <div className="flex items-center text-white text-opacity-80 text-sm mb-2 bg-white bg-opacity-10 px-2 py-1 rounded">
                            <span className="mr-1 font-medium">Method:</span>
                            <span className="capitalize">
                              {topic.teachingMethod === "socratic" && "Socratic Dialogue"}
                              {topic.teachingMethod === "roleplay" && "Roleplay"}
                              {topic.teachingMethod === "simulation" && "Simulation"}
                              {topic.teachingMethod === "explanation" && "Explanation"}
                              {topic.teachingMethod === "quizzes" && "Quizzes"}
                              {topic.teachingMethod === "custom" && "Custom Prompt"}
                            </span>
                          </div>
                        )}
                        
                        {/* AI Model display for Tier 4 */}
                        {tierLevel === 4 && topic.aiModel && (
                          <div className="flex items-center text-white text-opacity-80 text-sm mb-2 bg-white bg-opacity-10 px-2 py-1 rounded">
                            <span className="mr-1 font-medium">AI Model:</span>
                            <span>
                              {aiModels.find(model => model.id === topic.aiModel)?.name || topic.aiModel}
                            </span>
                          </div>
                        )}
                        
                        {/* Custom Prompt display for Tier 4 */}
                        {tierLevel === 4 && topic.teachingMethod === "custom" && topic.customPrompt && (
                          <div className="mb-2">
                            <div className="text-white text-opacity-80 text-sm font-medium mb-1">Custom Prompt:</div>
                            <div className="text-white text-opacity-80 bg-white bg-opacity-5 p-2 rounded-lg">
                              {topic.customPrompt}
                            </div>
                          </div>
                        )}
                        
                        {/* Topic content */}
                        {topic.content && (
                          <div 
                            className="text-white text-opacity-80 bg-white bg-opacity-5 p-2 rounded-lg mb-2"
                            dangerouslySetInnerHTML={{ __html: topic.content }}
                          ></div>
                        )}
                        
                        {/* Files list */}
                        {topic.files && topic.files.length > 0 && (
                          <div className="text-white text-opacity-80 pb-2">
                            <p className="text-sm font-medium mb-1">Attached Files:</p>
                            <ul className="space-y-1">
                              {topic.files.map((file, idx) => (
                                <li key={idx} className="flex items-center text-sm">
                                  <List className="mr-2" size={14} />
                                  {file}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Subtopics */}
                        {topic.subtopics && topic.subtopics.map((subtopic, idx) => (
                          <div key={idx} className="flex items-center py-1 px-2 text-sm text-white text-opacity-80">
                            <List className="mr-2" size={14} />
                            {subtopic}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const TieredInterface = () => {
  const [activeSection, setActiveSection] = useState(1);
  const sections = [
    { 
      id: 1, 
      title: "Tier 1", 
      color: "#1a2151", // Darker blue
      gradientFrom: "#1a2151",
      gradientTo: "#2c3e7e",
      pattern: "radial",
      textColor: "rgba(255, 255, 255, 0.9)",
      cardBg: "rgba(30, 40, 90, 0.5)",
      cardBorder: "rgba(100, 140, 255, 0.2)",
      accentColor: "#5d7ce4",
      buttonBg: "rgba(93, 124, 228, 0.3)",
      buttonBorder: "rgba(93, 124, 228, 0.5)"
    },
    { 
      id: 2, 
      title: "Tier 2", 
      color: "#421930", // Deep burgundy
      gradientFrom: "#421930",
      gradientTo: "#7a2d4d",
      pattern: "linear",
      textColor: "rgba(255, 255, 255, 0.9)",
      cardBg: "rgba(80, 30, 60, 0.5)",
      cardBorder: "rgba(255, 140, 160, 0.2)",
      accentColor: "#e45d7c",
      buttonBg: "rgba(228, 93, 124, 0.3)",
      buttonBorder: "rgba(228, 93, 124, 0.5)"
    },
    { 
      id: 3, 
      title: "Tier 3", 
      color: "#0e3321", // Dark forest green
      gradientFrom: "#0e3321",
      gradientTo: "#205c41",
      pattern: "mesh",
      textColor: "rgba(255, 255, 255, 0.9)",
      cardBg: "rgba(25, 60, 40, 0.5)",
      cardBorder: "rgba(100, 220, 150, 0.2)",
      accentColor: "#5dd48c",
      buttonBg: "rgba(93, 212, 140, 0.3)",
      buttonBorder: "rgba(93, 212, 140, 0.5)"
    },
    { 
      id: 4, 
      title: "Tier 4", 
      color: "#3b2e11", // Rich amber
      gradientFrom: "#3b2e11",
      gradientTo: "#6b541f",
      pattern: "dots",
      textColor: "rgba(255, 255, 255, 0.9)", 
      cardBg: "rgba(70, 55, 20, 0.5)",
      cardBorder: "rgba(255, 200, 100, 0.2)",
      accentColor: "#e4b65d",
      buttonBg: "rgba(228, 182, 93, 0.3)",
      buttonBorder: "rgba(228, 182, 93, 0.5)"
    }
  ];

  // Improved scroll handling to allow scrolling within tiers but prevent scrolling between tiers
  useEffect(() => {
    // We'll track whether a wheel event started inside a scrollable area
    let isScrollingInside = false;
    
    const handleWheel = (e) => {
      // Find the tier section that the user is currently in
      const currentTier = document.getElementById(`tier-${activeSection}`);
      if (!currentTier) return;
      
      // Find scrollable elements inside the current tier
      const scrollableContainer = currentTier.querySelector('.overflow-auto');
      
      if (scrollableContainer) {
        // Check if the event target is inside the scrollable container
        const isTargetInScrollableArea = scrollableContainer.contains(e.target);
        
        // Check if scrollable container is at top/bottom boundary
        const isAtTop = scrollableContainer.scrollTop === 0;
        const isAtBottom = scrollableContainer.scrollTop + scrollableContainer.clientHeight >= scrollableContainer.scrollHeight - 5; // 5px buffer
        
        // Allow scrolling if we're inside the scrollable area and not at boundary in the direction of scroll
        if (isTargetInScrollableArea && 
            !((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0))) {
          // Let the normal scroll happen inside the container
          return;
        }
      }
      
      // Prevent default scrolling behavior for wheel events outside scrollable areas
      // or at boundaries when trying to scroll beyond
      e.preventDefault();
    };
    
    // Handle touchstart to track where touch began
    const handleTouchStart = (e) => {
      const scrollableContainer = document.querySelector(`#tier-${activeSection} .overflow-auto`);
      if (scrollableContainer && scrollableContainer.contains(e.target)) {
        isScrollingInside = true;
      } else {
        isScrollingInside = false;
      }
    };
    
    // Handle touchmove - only prevent default if not in a scrollable container
    const handleTouchMove = (e) => {
      if (!isScrollingInside) {
        e.preventDefault();
      }
    };
    
    // Add event listeners with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeSection]);

  // Handle scroll events to update active section (only for button navigation)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Find which section should be active based on scroll position
      const currentSection = Math.floor(scrollPosition / windowHeight) + 1;
      setActiveSection(Math.min(currentSection, sections.length));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  // Handle navigation click
  const navigateToSection = (sectionId) => {
    const section = document.getElementById(`tier-${sectionId}`);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation indicators */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col items-center space-y-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => navigateToSection(section.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'w-5 h-5 bg-white border-2'
                  : 'bg-gray-400'
              }`}
              style={{
                borderColor: activeSection === section.id ? section.accentColor : 'transparent'
              }}
              aria-label={`Navigate to ${section.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main content sections */}
      {sections.map(section => (
        <section
          id={`tier-${section.id}`}
          key={section.id}
          className="relative h-screen flex flex-col items-center justify-center snap-start overflow-hidden"
          style={{ 
            background: section.pattern === 'radial' 
              ? `radial-gradient(circle at 30% 30%, ${section.gradientFrom}, ${section.gradientTo})`
              : section.pattern === 'mesh'
              ? `linear-gradient(135deg, ${section.gradientFrom}, ${section.gradientTo})`
              : section.pattern === 'dots'
              ? `linear-gradient(60deg, ${section.gradientFrom}, ${section.gradientTo})`
              : `linear-gradient(to right, ${section.gradientFrom}, ${section.gradientTo})`
          }}
        >
          {/* Background pattern overlay - different for each tier */}
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              opacity: 0.05,
              backgroundImage: section.pattern === 'radial'
                ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                : section.pattern === 'mesh'
                ? 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'
                : section.pattern === 'dots'
                ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'
                : 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          ></div>
          
          <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
            <span className="text-white text-xl font-bold opacity-40">
              {section.id.toString().padStart(2, '0')}
            </span>
          </div>
          
          {section.id === 1 || section.id === 2 || section.id === 3 || section.id === 4 ? (
            <div className="w-full h-full flex flex-col relative z-10">
              <div className="text-center pt-8">
                <h2 className="text-5xl font-bold mb-2 tracking-tight"
                  style={{ 
                    color: section.textColor,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                  }}>
                  {section.title}
                </h2>
                <p className="text-lg max-w-md mx-auto mb-8"
                  style={{ 
                    color: section.textColor,
                    opacity: 0.9 
                  }}>
                  Manage your teaching units and topics
                </p>
              </div>
              <div className="flex-grow overflow-auto px-4 md:px-8 pb-12"
                   style={{
                     scrollbarWidth: 'thin',
                     scrollbarColor: `${section.accentColor} transparent`
                   }}>
                <UnitsList tierLevel={section.id} tierTheme={section} key={`tier-${section.id}-units`} />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-7xl font-bold mb-6 text-white tracking-tight">
                {section.title}
              </h2>
              <p className="text-white text-xl max-w-md mx-auto opacity-80">
                Content for {section.title} goes here. Scroll down to explore more levels.
              </p>
            </div>
          )}
          
          {section.id < sections.length && (
            <div className="absolute bottom-8 animate-bounce z-10">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateToSection(section.id + 1);
                }}
                className="text-white hover:text-opacity-80 focus:outline-none p-2 bg-black bg-opacity-20 rounded-full"
                aria-label="Scroll down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default TieredInterface;