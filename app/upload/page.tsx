"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, ChevronRight, ChevronLeft, Upload, Loader2 } from 'lucide-react';

const STEPS = ['Basic Info', 'Media', 'Technical', 'Pricing'];

export default function UploadPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [title, setTitle] = useState('');
    const [developerName, setDeveloperName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Game');
    const [genre, setGenre] = useState('');
    const [type, setType] = useState('Indie');

    // Arrays
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [os, setOs] = useState<string[]>([]);
    const [aiFeatures, setAiFeatures] = useState(''); // comma separated

    // File/Pricing
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [priceModel, setPriceModel] = useState('Free');

    const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData.user) {
                router.push('/login');
                return;
            }

            let imageUrl = 'bg-gradient-to-br from-slate-700 to-indigo-900'; // fallback gradient

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${authData.user.id}/${fileName}`;

                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('thumbnails')
                    .upload(filePath, imageFile);

                if (!uploadError && uploadData) {
                    const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(filePath);
                    imageUrl = publicUrl;
                }
            }

            const parsedAiFeatures = aiFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);

            const { data: projectData, error: insertError } = await supabase.from('projects').insert({
                title,
                developer_name: developerName || authData.user.email?.split('@')[0] || 'Unknown Developer',
                description,
                category,
                genre,
                type,
                platforms,
                os,
                "aiFeatures": parsedAiFeatures,
                price_model: priceModel,
                image_url: imageUrl,
            }).select().single();

            if (insertError) throw insertError;

            // Insert initial metrics
            await supabase.from('metrics').insert({
                project_id: projectData.id,
                downloads_count: 0,
                upvotes: 0,
                downvotes: 0,
                hot_score: 0
            });

            router.push('/dashboard');
        } catch (error) {
            console.error("Error submitting project:", error);
            alert("Failed to submit project. Please check if storage bucket 'thumbnails' is public and configured.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 0 && (!title || !description || !genre)) {
            alert("Please fill out all required fields.");
            return;
        }
        if (currentStep === 1 && !imageFile && !imagePreview) {
            // Optional warning, let them pass if they want default gradient
        }
        if (currentStep === 2 && (platforms.length === 0 || os.length === 0)) {
            alert("Please select at least one Platform and OS.");
            return;
        }

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            handleSubmit();
        }
    };


    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-white tracking-tight text-center mb-8">Publish Your Project</h1>

                    {/* Stepper */}
                    <div className="flex items-center justify-between relative px-4">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full">
                            <div className="h-full bg-cyan-600 rounded-full transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                        </div>
                        {STEPS.map((step, index) => (
                            <div key={step} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${index <= currentStep ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'
                                    }`}>
                                    {index < currentStep ? <CheckCircle size={16} /> : index + 1}
                                </div>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${index <= currentStep ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                    {/* Step 1: Basic Info */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Project Title *</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600" placeholder="e.g. Neon Protocol" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Category *</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
                                        <option value="Game">Game</option>
                                        <option value="App">App</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Genre *</label>
                                    <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600" placeholder="e.g. RPG, Productivity" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Developer Name</label>
                                <input type="text" value={developerName} onChange={e => setDeveloperName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600" placeholder="Studio or Creator Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Short Description *</label>
                                <textarea maxLength={200} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600 resize-none h-24" placeholder="Briefly explain what your project does..." />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Media */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Project Thumbnail</label>
                                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-950 transition-colors group cursor-pointer relative overflow-hidden">
                                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />

                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-cyan-900/50 group-hover:text-cyan-400 text-slate-400">
                                                <Upload size={28} />
                                            </div>
                                            <p className="text-white font-semibold text-lg text-center">Click or drag image to upload</p>
                                            <p className="text-slate-500 text-sm mt-1 text-center">Aspect ratio 4:3 (JPEG, PNG, WEBP)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Technical Constraints */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Supported Platforms *</label>
                                <div className="flex flex-wrap gap-3">
                                    {['PC', 'Console', 'Mobile', 'Web', 'VR'].map(p => (
                                        <button key={p} onClick={() => toggleArrayItem(setPlatforms, p)} className={`px-4 py-2 rounded-lg font-medium border transition-all ${platforms.includes(p) ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Operating Systems *</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Web'].map(o => (
                                        <button key={o} onClick={() => toggleArrayItem(setOs, o)} className={`px-4 py-2 rounded-lg font-medium border transition-all ${os.includes(o) ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Production Type</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
                                    <option value="Indie">Indie / Prototype</option>
                                    <option value="AA">Single/Small Studio (AA)</option>
                                    <option value="AAA">Large Studio (AAA)</option>
                                    <option value="Utility">Utility</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">AI Features (Comma Separated)</label>
                                <input type="text" value={aiFeatures} onChange={e => setAiFeatures(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600" placeholder="e.g. Agentic NPCs, Image Gen, Auto-Research" />
                            </div>
                        </div>
                    )}


                    {/* Step 4: Pricing */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Pricing Model</label>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Free', sub: 'Completely free to use' },
                                        { label: 'Free (Ads)', sub: 'Ad supported' },
                                        { label: 'Free (IAP)', sub: 'In-app purchases or microtransactions' },
                                        { label: 'Free + API Costs', sub: 'Bring your own key (BYOK)' },
                                        { label: '$9.99', sub: 'One-time purchase example' },
                                        { label: '$9.99/mo', sub: 'Subscription model' }
                                    ].map(model => (
                                        <div key={model.label} onClick={() => setPriceModel(model.label)} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${priceModel === model.label ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${priceModel === model.label ? 'border-cyan-400' : 'border-slate-600'}`}>
                                                {priceModel === model.label && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${priceModel === model.label ? 'text-white' : 'text-slate-300'}`}>{model.label}</h4>
                                                <p className="text-xs text-slate-500">{model.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {['$9.99', '$9.99/mo'].includes(priceModel) && (
                                    <div className="mt-4 animate-in fade-in">
                                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Custom Price String</label>
                                        <input type="text" value={priceModel} onChange={e => setPriceModel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none placeholder-slate-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-800">
                        <button
                            onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
                            disabled={currentStep === 0 || isSubmitting}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors border ${currentStep === 0 ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                        >
                            <ChevronLeft size={18} /> Back
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-transform active:scale-95 shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Publishing...</>
                            ) : currentStep === STEPS.length - 1 ? (
                                <><Upload size={18} /> Publish Project</>
                            ) : (
                                <>Continue <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
