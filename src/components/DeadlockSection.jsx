export default function DeadlockSection() {
  return (
    <section className="py-16 px-6 bg-[#0a0d14] text-slate-100">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          Deadlock Management
        </h2>

        <p className="text-center text-slate-300 mb-12">
          Understanding Deadlocks using a Traffic Intersection
        </p>

        {/* Deadlock Conditions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md border-l-4 border-l-red-500">
            <h3 className="font-bold text-lg mb-2">Mutual Exclusion</h3>
            <p>Only one lane can access the intersection at a time.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md border-l-4 border-l-yellow-500">
            <h3 className="font-bold text-lg mb-2">Hold & Wait</h3>
            <p>A lane waits while holding access to a resource.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md border-l-4 border-l-blue-500">
            <h3 className="font-bold text-lg mb-2">No Preemption</h3>
            <p>A resource cannot be forcibly taken away.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md border-l-4 border-l-green-500">
            <h3 className="font-bold text-lg mb-2">Circular Wait</h3>
            <p>North → East → South → West → North</p>
          </div>

        </div>

        {/* Deadlock Status */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-red-300">
            ⚠ DEADLOCK DETECTED
          </h3>

          <p className="mt-4">
            All lanes are waiting for each other, causing traffic flow to stop.
          </p>
        </div>

      </div>
    </section>
  );
}